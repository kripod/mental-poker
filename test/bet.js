import test from 'ava';
import { Bet, BetType } from '../src';

test('serialization', (t) => {
  const bet = new Bet({ type: BetType.CHECK });
  t.deepEqual(Object.keys(bet.toJSON()), ['type', 'amount']);
});
