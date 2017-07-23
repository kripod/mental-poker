import test from 'ava';
import Bet from './bet';
import BetType from './enums/bet-type';

test('serialization', (t) => {
  const bet = new Bet({ type: BetType.CHECK });
  t.deepEqual(Object.keys(bet.toJSON()), ['type', 'amount']);
});
