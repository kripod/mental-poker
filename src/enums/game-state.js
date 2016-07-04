/**
 * Represents the state of a game.
 * @enum {number}
 */
const GameState = {
  GENERATING_DECK_POINTS: 10,
  SHUFFLING_DECK: 20,
  LOCKING_DECK: 30,
  PLAYING: 40,
  ENDED: 50,
};

module.exports = GameState;
