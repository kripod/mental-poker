import test from 'ava';
import { Card, Config, Errors } from './../src';

const cardStringsInOrder = [
  '2c', '3c', '4c', '5c', '6c', '7c', '8c', '9c', 'Tc', 'Jc', 'Qc', 'Kc', 'Ac',
  '2d', '3d', '4d', '5d', '6d', '7d', '8d', '9d', 'Td', 'Jd', 'Qd', 'Kd', 'Ad',
  '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', 'Th', 'Jh', 'Qh', 'Kh', 'Ah',
  '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', 'Ts', 'Js', 'Qs', 'Ks', 'As',
];

test('constructor (by id)', (t) => {
  t.deepEqual(
    Array.from(new Array(Config.cardsInDeck), (v, i) => new Card(i).toString()),
    cardStringsInOrder
  );

  t.throws(() => new Card(-1), Errors.InvalidCardValueError);
  t.throws(() => new Card(Config.cardsInDeck), Errors.InvalidCardValueError);
});

test('constructor (by shorthand)', (t) => {
  t.deepEqual(
    cardStringsInOrder.map((cardString) => new Card(cardString).id),
    Array.from(new Array(Config.cardsInDeck), (v, i) => i)
  );

  t.throws(() => new Card(''), Errors.InvalidCardValueError);
  t.throws(() => new Card('0c'), Errors.InvalidCardValueError);
  t.throws(() => new Card('2x'), Errors.InvalidCardValueError);
});

test('constructor (invalid)', (t) => {
  t.throws(() => new Card(0.1), Errors.InvalidCardValueError);
});
