import BigInt from 'bn.js';
import { Game as PokerSolverGame, Hand as PokerSolverHand } from 'pokersolver';
import Bet from './bet';
import Card from './card';
import Config from './config';
import Deck from './deck';
import GameState from './enums/game-state';
import Player from './player';
import * as Utils from './utils';
import type {
  GameJSON,
  GameStateValue,
  Hand,
  PlayerJSON,
  Point,
} from './interfaces';

/**
 * A mutable object which serves as an entry point for creating mental poker
 * games.
 * @class Game
 */
export default class Game {
  /**
   * Represents the current state of the game.
   */
  state: GameStateValue = GameState.GENERATING_INITIAL_DECK;

  /**
   * Ordered list of players of the game.
   */
  players: Player[];

  /**
   * Player object of self.
   */
  playerSelf: Player;

  /**
   * Index of the currently acting player in the turn. `-1` if the game has
   * ended.
   */
  actingPlayerIndex: number = 0;

  /**
   * Keeps an ordered list of decks used throughout the game, allowing easy
   * verification at the end of the game.
   */
  deckSequence: Deck[] = [];

  /**
   * Keeps an ordered list of unpickable (owned or opened) card indexes.
   */
  unpickableCardIndexes: number[] = [];

  /**
   * Keeps an ordered list of community cards.
   */
  cardsOfCommunity: Card[] = [];

  /**
   * @param {?Object} params Parameters to be assigned to the new instance.
   */
  constructor(params: ?Object) {
    Object.assign(this, params);

    if (!this.playerSelf) {
      for (const player of this.players) {
        // The player whose secrets are known should be self
        let isSelf = true;
        for (const secret of player.secrets) {
          if (!secret) {
            isSelf = false;
            break;
          }
        }

        if (isSelf) {
          this.playerSelf = player;
          break;
        }
      }
    }
  }

  /**
   * Returns the currently acting player in the turn.
   * @returns {Player}
   */
  get actingPlayer(): Player {
    return this.players[this.actingPlayerIndex];
  }

  /**
   * Returns all card indexes which are not yet owned or opened by anyone.
   * @returns {number[]}
   */
  getPickableCardIndexes(): number[] {
    return Array.from(
      new Array(Config.cardsInDeck),
      (v: null, i: number): number => i
    )
      .filter((v: number): boolean =>
        this.unpickableCardIndexes.indexOf(v) < 0
      );
  }

  /**
   * Returns a random pickable card index.
   * @returns {number}
   */
  getRandomPickableCardIndex(): number {
    const pickableCardIndexes = this.getPickableCardIndexes();

    // Return the index of a pickable card
    return pickableCardIndexes[
      Utils.getRandomInt(0, pickableCardIndexes.length)
    ];
  }

  /**
   * Generates the initial deck of the game's deck sequence. By default, points
   * of players will be used for generating deck points. If any player-generated
   * point is missing, then deck points will be generated at random.
   * @returns {Game}
   */
  generateInitialDeck(): Game {
    // Try generating points by combining the points of players
    let deckPoints = new Array(Config.cardsInDeck);
    for (const { points: playerPoints } of this.players) {
      // On failure, generate deck points at random
      if (playerPoints.length !== Config.cardsInDeck) {
        deckPoints = Utils.getRandomPoints();
        break;
      }

      for (let i = playerPoints.length - 1; i >= 0; --i) {
        const playerPoint = playerPoints[i];
        const deckPoint = deckPoints[i];

        // Add the player's current point to the corresponding deck point
        deckPoints[i] = deckPoint ? deckPoint.add(playerPoint) : playerPoint;
      }
    }

    this.deckSequence = [new Deck(deckPoints)];
    this.state = GameState.SHUFFLING_DECK;
    return this;
  }

  /**
   * Shuffles the deck using the secrets of self, and on request, adds it to the
   * deck sequence of the game.
   * @param {Player} [player] Player object to shuffle the deck with. Defaults
   * to the player object of self.
   * @param {boolean} [isAddableToSequence=true] True whether the result should
   * be added to the game's deck sequence on success.
   * @param {Deck} [deck] Deck to be shuffled. If omitted, then uses the last
   * deck in the game's deck sequence.
   * @returns {?Deck} Null if an invalid parameter was specified.
   */
  shuffleDeck(
    player: Player = this.playerSelf,
    isAddableToSequence: boolean = true,
    deck: Deck = this.deckSequence[this.deckSequence.length - 1]
  ): ?Deck {
    if (!deck) return null;

    // Improve the accessibility of secrets later by using the last one now
    const lastSecret = player.secrets[player.secrets.length - 1];

    // Shuffle the deck and then encrypt it to avoid data leaks
    const nextDeck = deck.shuffle().encrypt(lastSecret);
    if (isAddableToSequence) {
      this.addDeckToSequence(nextDeck);
    }
    return nextDeck;
  }

  /**
   * Locks the deck using the secrets of self, and on request, adds it to the
   * deck sequence of the game.
   * @param {Player} [player] Player object to lock the deck with. Defaults to
   * the player object of self.
   * @param {boolean} [isAddableToSequence=true] True whether the result should
   * be added to the game's deck sequence on success.
   * @param {Deck} [deck] Deck to be locked. If omitted, then uses the last deck
   * in the game's deck sequence.
   * @returns {?Deck} Null if an invalid parameter was specified.
   */
  lockDeck(
    player: Player = this.playerSelf,
    isAddableToSequence: boolean = true,
    deck: Deck = this.deckSequence[this.deckSequence.length - 1]
  ): ?Deck {
    if (!deck) return null;

    const lastSecret = player.secrets[player.secrets.length - 1];

    // Remove the shuffle encryption and then lock each card one by one
    const nextDeck = deck.decrypt(lastSecret).lock(player.secrets);
    if (isAddableToSequence) {
      this.addDeckToSequence(nextDeck);
    }
    return nextDeck;
  }

  /**
   * Adds a shuffled or locked deck to the game's deck sequence. Automatically
   * takes turn on behalf of the currently acting player, and updates game state
   * if necessary.
   * @param {Deck} deck Deck to be added to the game's deck sequence.
   * @returns {boolean} True if the action was successful.
   */
  addDeckToSequence(deck: Deck): boolean {
    // Disallow modifying deck sequence if the game has already started
    if (this.state >= GameState.PLAYING) return false;

    this.deckSequence.push(deck);

    // Update game state if the turn has come to an end
    if (this.takeTurn() === 0) {
      this.state = this.state === GameState.SHUFFLING_DECK ?
        GameState.LOCKING_DECK :
        GameState.PLAYING;
    }

    return true;
  }

  /**
   * Takes turn on behalf of the currently acting player, updating
   * `actingPlayerIndex` with the next value in its cycle.
   * @param {?Bet} [bet] Bet made by the currently acting player.
   * @returns {number} Index of the next player in turn.
   */
  takeTurn(bet: ?Bet): number {
    if (bet) {
      this.actingPlayer.bets.push(bet);
    }

    // Check whether only 1 player is left in the game
    if (this.players.filter((player: Player): boolean =>
      !player.hasFolded
    ).length === 1) {
      // End the game immediately
      this.end();
    } else {
      // Advance to the next player who hasn't folded
      do {
        this.actingPlayerIndex =
          (this.actingPlayerIndex + 1) % this.players.length;
      } while (this.actingPlayer.hasFolded);
    }

    return this.actingPlayerIndex;
  }

  /**
   * Picks an unowned card at the given index, unlocking it by its corresponding
   * secrets.
   * @param {number} index Index of the card to be picked.
   * @param {boolean} [isMadeUnpickable=true] Determines whether the picked card
   * should be made unpickable on success.
   * @returns {?Card} On success, an instance of the picked card. Otherwise (if
   * any of the necessary secrets are unknown or the card at the given index has
   * already been drawn), null.
   */
  pickCard(index: number, isMadeUnpickable: boolean = true): ?Card {
    if (this.unpickableCardIndexes.indexOf(index) < 0) {
      // Gather each player's secret at the given index
      const secrets = this.players.map((player: Player): BigInt =>
        player.secrets[index]
      );

      const currentDeck = this.deckSequence[this.deckSequence.length - 1];
      const pointUnlocked = currentDeck.unlockSingle(index, secrets);
      const initialDeckPoints = this.deckSequence[0].points;

      for (let i = initialDeckPoints.length - 1; i >= 0; --i) {
        if (initialDeckPoints[i].eq(pointUnlocked)) {
          // Make the unlocked card unpickable if necessary
          if (isMadeUnpickable) {
            this.unpickableCardIndexes.push(index);
          }

          return new Card(i);
        }
      }
    }

    return null;
  }

  /**
   * Picks an unowned card at the given index, and then draws it to the hand of
   * self.
   * @param {number} index Index of the card to be drawn.
   * @returns {?Card} On success, an instance of the drawn card. Otherwise (if
   * any of the necessary secrets are unknown or the card at the given index has
   * already been drawn), null.
   */
  drawCard(index: number): ?Card {
    const card = this.pickCard(index);
    if (card) {
      this.playerSelf.cardsInHand.push(card);
    }

    return card;
  }

  /**
   * Picks an unowned card at the given index, and then opens it as a community
   * card.
   * @param {number} index Index of the card to be opened.
   * @returns {?Card} On success, an instance of the opened card. Otherwise (if
   * any of the necessary secrets are unknown or the card at the given index has
   * already been drawn), null.
   */
  openCard(index: number): ?Card {
    const card = this.pickCard(index);
    if (card) {
      this.cardsOfCommunity.push(card);
    }

    return card;
  }

  /**
   * Ends the game immediately, making no more player action possible.
   */
  end() {
    this.actingPlayerIndex = -1;
    this.state = GameState.ENDED;
  }

  /**
   * Verifies the entire game, looking for players who were not playing fairly.
   * @returns {Player[]} List of unfair players.
   */
  verify(): Player[] {
    const result = [];
    for (let i = this.players.length - 1; i >= 0; --i) {
      const player = this.players[i];

      if (
        // Check for deck shuffling mistakes
        !Utils.isArrayEqualWith(
          Utils.sortPoints(
            [...this.shuffleDeck(player, false, this.deckSequence[i]).points]
          ),
          Utils.sortPoints([...this.deckSequence[i + 1].points]),
          (p1: Point, p2: Point): boolean => p1.eq(p2)
        ) ||

        // Check for deck locking mistakes
        !Utils.isArrayEqualWith(
          this.lockDeck(
            player,
            false,
            this.deckSequence[this.players.length + i]
          ).points,
          this.deckSequence[this.players.length + i + 1].points,
          (p1: Point, p2: Point): boolean => p1.eq(p2)
        )
      ) {
        result.push(player);
      }
    }

    return result;
  }

  /**
   * Evaluates the hands of players, looking for the winner(s) of the game.
   * @param {string} [gameType=Config.gameType] Type of the game to evaluate
   * hands for.
   * @returns {Player[]} List of players who won the game.
   */
  evaluateHands(gameType: string = Config.gameType): Player[] {
    const pokerSolverGame = new PokerSolverGame(gameType);
    const commonCardStrings = this.cardsOfCommunity.map((card: Card): string =>
      card.toString()
    );

    // Evaluate the hand of players who haven't folded
    const handsOfPlayers = new Map();
    for (const player of this.players) {
      if (!player.hasFolded) {
        handsOfPlayers.set(
          PokerSolverHand.solve([
            ...commonCardStrings,
            ...player.cardsInHand.map((card: Card): string => card.toString()),
          ], pokerSolverGame),
          player
        );
      }
    }

    // Look for winner hands and map them to their owners
    return PokerSolverHand.winners([...handsOfPlayers.keys()])
      .map((hand: Hand): Player => handsOfPlayers.get(hand));
  }

  toJSON(): GameJSON {
    return {
      state: GameState.toString(this.state),
      players: this.players.map((player: Player): PlayerJSON =>
        player.toJSON()
      ),
      actingPlayerIndex: this.actingPlayerIndex,
      ...(this.deckSequence[0] && this.deckSequence[0].toJSON()),
    };
  }
}
