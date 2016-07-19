const Config = require('./config');
const Deck = require('./deck');
const GameState = require('./enums/game-state');
const Utils = require('./utils');

/**
 * A mutable object which serves as an entry point for creating mental poker
 * games.
 */
class Game {
  /**
   * Ordered list of players of the game.
   * @type {Player[]}
   * @member players
   * @memberof Game
   */

  /**
   * Index of the currently acting player in the turn. `-1` if the game has
   * ended.
   * @type {number}
   * @member actingPlayerIndex
   * @memberof Game
   */

  /**
   * Represents the current state of the game.
   * @type {GameState}
   * @member state
   * @memberof Game
   */

  /**
   * Keeps an ordered list of decks used throughout the game, allowing easy
   * verification at the end of the game.
   * @type {Deck[]}
   * @member deckSequence
   * @memberof Game
   */

  /**
   * Keeps an ordered list of unpickable (owned or opened) card indexes.
   * @type {number[]}
   * @member unpickableCardIndexes
   * @memberof Game
   */

  /**
   * Keeps an ordered list of community card IDs.
   * @type {number[]}
   * @member cardsOnTable
   * @memberof Game
   */

  constructor(params) {
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

    this.state = GameState.GENERATING_INITIAL_DECK;
    this.actingPlayerIndex = 0;

    this.deckSequence = [];
    this.unpickableCardIndexes = [];
    this.cardsOnTable = [];
  }

  /**
   * Returns the currently acting player in the turn.
   * @returns {Player}
   */
  get actingPlayer() {
    return this.players[this.actingPlayerIndex];
  }

  /**
   * Returns all card indexes which are not yet owned or opened by anyone.
   * @returns {number[]}
   */
  getPickableCardIndexes() {
    return Array.from(new Array(Config.cardsInDeck), (v, i) => i)
      .filter((v) => this.unpickableCardIndexes.indexOf(v) < 0);
  }

  /**
   * Returns a random pickable card index.
   * @returns {number}
   */
  getRandomPickableCardIndex() {
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
  generateInitialDeck() {
    // Try generating points by combining the points of players
    // TODO: Avoid duplicate deck points
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
        deckPoints[i] = deckPoint ? playerPoint.add(deckPoint) : playerPoint;
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
    player = this.playerSelf,
    isAddableToSequence = true,
    deck = this.deckSequence[this.deckSequence.length - 1]
  ) {
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
    player = this.playerSelf,
    isAddableToSequence = true,
    deck = this.deckSequence[this.deckSequence.length - 1]
  ) {
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
   * @param {Deck} deck
   * @returns {boolean} True if the action was successful.
   */
  addDeckToSequence(deck) {
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
   * @param {Bet} [bet] Bet made by the currently acting player.
   * @returns {number} Index of the next player in turn.
   */
  takeTurn(bet) {
    if (bet) {
      this.actingPlayer.bets.push(bet);
    }

    // Check whether only 1 player is left in the game
    if (this.players.filter((player) => !player.hasFolded).length === 1) {
      // End the game immediately
      this.actingPlayerIndex = -1;
      this.state = GameState.ENDED;
    } else {
      // Advance to the next player who hasn't folded
      do {
        this.actingPlayerIndex =
          (this.actingPlayerIndex + 1) % this.players.length;
      } while (!this.actingPlayer.hasFolded);
    }

    return this.actingPlayerIndex;
  }

  /**
   * Picks an unowned card at the given index, unlocking it by its corresponding
   * secrets.
   * @param {number} index Index of the card to be picked.
   * @param {boolean} [isMadeUnpickable=true] Determines whether the picked card
   * should be made unpickable on success.
   * @returns {number} On success, the ID of the picked card. Otherwise (if any
   * of the necessary secrets are unknown or the card at the given index has
   * already been drawn), -1.
   */
  pickCard(index, isMadeUnpickable = true) {
    if (this.unpickableCardIndexes.indexOf(index) < 0) {
      // Gather each player's secret at the given index
      const secrets = this.players.map((player) => player.secrets[index]);

      const currentDeck = this.deckSequence[this.deckSequence.length - 1];
      const pointUnlocked = currentDeck.unlockSingle(index, secrets);
      const initialDeckPoints = this.deckSequence[0].points;

      for (let i = initialDeckPoints.length - 1; i >= 0; --i) {
        if (initialDeckPoints[i].eq(pointUnlocked)) {
          // Make the unlocked card unpickable if necessary
          if (isMadeUnpickable) {
            this.unpickableCardIndexes.push(index);
          }

          return i;
        }
      }
    }

    return -1;
  }

  /**
   * Picks an unowned card at the given index, and then draws it to the hand of
   * self.
   * @param {number} index Index of the card to be drawn.
   * @returns {number} On success, the ID of the drawn card. Otherwise (if any
   * of the necessary secrets are unknown or the card at the given index has
   * already been drawn), -1.
   */
  drawCard(index) {
    const cardId = this.pickCard(index);
    if (cardId >= 0) {
      this.playerSelf.cardsInHand.push(cardId);
    }

    return cardId;
  }

  /**
   * Picks an unowned card at the given index, and then opens it as a community
   * card on the table.
   * @param {number} index Index of the card to be opened.
   * @returns {number} On success, the ID of the opened card. Otherwise (if any
   * of the necessary secrets are unknown or the card at the given index has
   * already been drawn), -1.
   */
  openCard(index) {
    const cardId = this.pickCard(index);
    if (cardId >= 0) {
      this.cardsOnTable.push(cardId);
    }

    return cardId;
  }

  /**
   * Verifies the entire game, looking for players who were not playing fairly.
   * @returns {Player[]} List of unfair players.
   */
  verify() {
    const result = [];
    for (const player of this.players) {
      if (!player.verifySecretsByHashes) {
        result.push(player);
      }
    }

    return result;
  }

  toJSON() {
    return Object.assign(
      {
        players: this.players.map((player) => player.toJSON()),
        actingPlayerIndex: this.actingPlayerIndex,
        state: this.state,
      },
      this.deckSequence[0] ? this.deckSequence[0].toJSON() : {}
    );
  }
}

module.exports = Game;
