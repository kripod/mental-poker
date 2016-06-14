import test from 'ava';
import { Config, Player } from './../src';

test('constructor without params', (t) => {
  const player = new Player();

  t.is(player.points.length, Config.cardsInDeck);

  t.is(player.secrets.length, Config.cardsInDeck + 1);
  t.is(player.secretHashes.length, player.secrets.length);

  for (const secret of player.secrets) {
    t.true(secret.gten(1));
    t.true(secret.lt(Config.ec.n));
  }
});

test('constructor with params', (t) => {
  const points = [];
  const player = new Player({ points });

  t.is(player.points, points);
});
