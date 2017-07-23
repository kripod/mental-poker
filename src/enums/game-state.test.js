import test from 'ava';
import GameState from './game-state';

const expectedResults = new Map([
  [GameState.UNSTARTED, 'unstarted'],
  [GameState.GENERATING_INITIAL_DECK, 'generatingInitialDeck'],
  [GameState.SHUFFLING_DECK, 'shufflingDeck'],
  [GameState.LOCKING_DECK, 'lockingDeck'],
  [GameState.PLAYING, 'playing'],
  [GameState.ENDED, 'ended'],
]);

test('toString', (t) => {
  expectedResults.forEach((value, key) => t.is(GameState.toString(key), value));
});

test('fromString', (t) => {
  expectedResults.forEach((value, key) => t.is(GameState.fromString(value), key));
});
