import test from 'ava';
import BetType from './bet-type';

const expectedResults = new Map([
  [BetType.FOLD, 'fold'],
  [BetType.CHECK, 'check'],
  [BetType.CALL, 'call'],
  [BetType.RAISE, 'raise'],
]);

test('toString', (t) => {
  expectedResults.forEach((value, key) => t.is(BetType.toString(key), value));
});

test('fromString', (t) => {
  expectedResults.forEach((value, key) => t.is(BetType.fromString(value), key));
});
