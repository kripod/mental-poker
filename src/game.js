const Config = require('./config');
const Deck = require('./deck');
const GameState = require('./enums/game-state');
const Player = require('./player');
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
   * Index of the currently acting player in the turn.
   * @type {number}
   * @member turnPlayerIndex
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
   * Keeps an ordered list of owned card indexes.
   * @type {number[]}
   * @member ownedCardIndexes
   * @memberof Game
   */

  /**
   * Keeps an ordered list of community card IDs.
   * @type {number[]}
   * @member cardsOnTable
   * @memberof Game
   */

  /**
   * @param {Player[]} players Ordered list of players of the game.
   * @param {Player} [playerSelf] The player object of self, which should also
   * be contained in `players`. Auto-detected if omitted.
   */
  constructor(players = [new Player()], playerSelf) {
    this.players = players;
    if (playerSelf) {
      this.playerSelf = playerSelf;
    } else {
      for (const player of players) {
        // The player whose secrets are known should be self
        if (player.secrets[0]) {
          this.playerSelf = player;
          return;
        }
      }
    }

    this.state = GameState.GENERATING_DECK_POINTS;
    this.turnPlayerIndex = 0;

    this.deckSequence = [];
    this.ownedCardIndexes = [];
    this.cardsOnTable = [];
  }

  /**
   * Returns all card indexes which are not yet owned or opened by anyone.
   * @returns {number[]}
   */
  getUnownedCardIndexes() {
    return Array.from(new Array(Config.cardsInDeck), (v, i) => i)
      .filter((v) => this.ownedCardIndexes.indexOf(v) < 0);
  }

  /**
   * Returns a random unowned card index.
   * @returns {number}
   */
  getRandomUnownedCardIndex() {
    const unownedCardIndexes = this.getUnownedCardIndexes();

    // Return the index of an unowned card
    return unownedCardIndexes[
      Utils.getRandomInt(0, unownedCardIndexes.length)
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
   * @param {Deck} [deck] Deck to be shuffled. If omitted, then uses the last
   * deck in the game's deck sequence.
   * @param {boolean} [isAddableToSequence=true] True whether the result should
   * be added to the game's deck sequence on success.
   * @returns {?Deck} Null if an invalid parameter was specified.
   */
  shuffleDeck(
    deck = this.deckSequence[this.deckSequence.length - 1],
    isAddableToSequence = true,
  ) {
    if (!deck) return null;

    // Improve the accessibility of secrets later by using the last one now
    const lastSecret = this.secrets[this.secrets.length - 1];

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
   * @param {Deck} [deck] Deck to be locked. If omitted, then uses the last deck
   * in the game's deck sequence.
   * @param {boolean} [isAddableToSequence=true] True whether the result should
   * be added to the game's deck sequence on success.
   * @returns {?Deck} Null if an invalid parameter was specified.
   */
  lockDeck(
    deck = this.deckSequence[this.deckSequence.length - 1],
    isAddableToSequence = true,
  ) {
    if (!deck) return null;

    const lastSecret = this.secrets[this.secrets.length - 1];

    // Remove the shuffle encryption and then lock each card one by one
    const nextDeck = deck.decrypt(lastSecret).lock(this.secrets);
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
   * `turnPlayerIndex` if `playerCount` is a positive integer.
   * @returns {number} On success, the index of the next player in turn.
   * Otherwise, -1.
   */
  takeTurn() {
    if (this.playerCount <= 0) return -1;

    this.turnPlayerIndex = (this.turnPlayerIndex + 1) % this.playerCount;
    return this.turnPlayerIndex;
  }

  /**
   * Draws an unowned card at the given index, unlocking it by its corresponding
   * secrets.
   * @param {number} index Index of the card to be drawn.
   * @returns {number} On success, the ID of the drawn card. Otherwise (if any
   * of the necessary secrets are unknown or the card at the given index has
   * already been drawn), -1.
   */
  drawCard(index) {
    if (this.ownedCardIndexes.indexOf(index) < 0) {
      // Gather each player's secret at the given index
      const secrets = this.players.map((player) => player.secrets[index]);

      const currentDeck = this.deckSequence[this.deckSequence.length - 1];
      const pointUnlocked = currentDeck.unlockSingle(index, secrets);
      const initialDeckPoints = this.deckSequence[0].points;

      for (let i = initialDeckPoints.length - 1; i >= 0; --i) {
        if (initialDeckPoints[i].eq(pointUnlocked)) {
          this.ownedCardIndexes.push(index);
          return i;
        }
      }
    }

    return -1;
  }

  verify() {
    // TODO
  }
}

module.exports = Game;
