/**
 * Represents the state of a game.
 * @enum {number}
 */
const GameState = {
  UNSTARTED: 0,
  GENERATING_INITIAL_DECK: 10,
  SHUFFLING_DECK: 20,
  LOCKING_DECK: 30,
  PLAYING: 40,
  ENDED: 50,
};

export default GameState;
