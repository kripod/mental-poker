import test from 'ava';
import { Card, Config } from './../src';

const cardStringsInOrder = [
  '2c', '3c', '4c', '5c', '6c', '7c', '8c', '9c', 'Tc', 'Jc', 'Qc', 'Kc', 'Ac',
  '2d', '3d', '4d', '5d', '6d', '7d', '8d', '9d', 'Td', 'Jd', 'Qd', 'Kd', 'Ad',
  '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', 'Th', 'Jh', 'Qh', 'Kh', 'Ah',
  '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', 'Ts', 'Js', 'Qs', 'Ks', 'As',
];

test('construct by id', (t) => {
  t.deepEqual(
    Array.from(new Array(Config.cardsInDeck), (v, i) => new Card(i).toString()),
    cardStringsInOrder
  );
});

test('construct by shorthand', (t) => {
  t.deepEqual(
    cardStringsInOrder.map((cardString) => new Card(cardString).id),
    Array.from(new Array(Config.cardsInDeck), (v, i) => i)
  );
});
