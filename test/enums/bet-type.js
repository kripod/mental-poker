import test from 'ava';
import { BetType } from './../../src';

const expectedResults = new Map([
  [BetType.FOLD, 'fold'],
  [BetType.CHECK, 'check'],
  [BetType.CALL, 'call'],
  [BetType.RAISE, 'raise'],
]);

test('toString', (t) => {
  for (const [key, value] of expectedResults) {
    t.is(BetType.toString(key), value);
  }
});

test('fromString', (t) => {
  for (const [key, value] of expectedResults) {
    t.is(BetType.fromString(value), key);
  }
});
