import type { GameStateValue } from '../interfaces';

/**
 * Represents the state of a game.
 * @enum {number}
 */
const GameState = {
  UNSTARTED: 0,
  GENERATING_INITIAL_DECK: 1,
  SHUFFLING_DECK: 2,
  LOCKING_DECK: 3,
  PLAYING: 4,
  ENDED: 5,

  toString(value: GameStateValue): string {
    switch (value) {
      case GameState.GENERATING_INITIAL_DECK:
        return 'generatingInitialDeck';
      case GameState.SHUFFLING_DECK:
        return 'shufflingDeck';
      case GameState.LOCKING_DECK:
        return 'lockingDeck';
      case GameState.PLAYING:
        return 'playing';
      case GameState.ENDED:
        return 'ended';
      default:
        return 'unstarted';
    }
  },

  fromString(value: string): GameStateValue {
    switch (value) {
      case 'generatingInitialDeck':
        return GameState.GENERATING_INITIAL_DECK;
      case 'shufflingDeck':
        return GameState.SHUFFLING_DECK;
      case 'lockingDeck':
        return GameState.LOCKING_DECK;
      case 'playing':
        return GameState.PLAYING;
      case 'ended':
        return GameState.ENDED;
      default:
        return GameState.UNSTARTED;
    }
  },
};

export default GameState;
