import test from 'ava';
import { GameState } from './../../src';

const expectedResults = new Map([
  [GameState.UNSTARTED, 'unstarted'],
  [GameState.GENERATING_INITIAL_DECK, 'generatingInitialDeck'],
  [GameState.SHUFFLING_DECK, 'shufflingDeck'],
  [GameState.LOCKING_DECK, 'lockingDeck'],
  [GameState.PLAYING, 'playing'],
  [GameState.ENDED, 'ended'],
]);

test('toString', (t) => {
  for (const [key, value] of expectedResults) {
    t.is(GameState.toString(key), value);
  }
});

test('fromString', (t) => {
  for (const [key, value] of expectedResults) {
    t.is(GameState.fromString(value), key);
  }
});
