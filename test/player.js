import test from 'ava';
import { Config, Player, Utils } from './../src';

test('construct by secrets', (t) => {
  const player = new Player({ secrets: Utils.getRandomSecrets() });

  t.is(player.secretHashes.length, player.secrets.length);
});

test('points generation', (t) => {
  const player = new Player().generatePoints();

  t.is(player.points.length, Config.cardsInDeck);
});

test('secrets accessibility', (t) => {
  const player = new Player();

  t.is(player.secrets.length, Config.cardsInDeck + 1);
});

test('secrets generation', (t) => {
  const player = new Player().generateSecrets();

  t.is(player.secretHashes.length, Config.cardsInDeck + 1);

  for (const secret of player.secrets) {
    t.true(secret.gten(1));
    t.true(secret.lt(Config.ec.n));
  }
});

test('secrets verification', (t) => {
  const player = new Player().generateSecrets();
  t.true(player.verifySecretsByHashes());

  // Make a hash incorrect
  player.secretHashes[0] = null;
  t.false(player.verifySecretsByHashes());
});

test('serialization', (t) => {
  const player = new Player();
  t.deepEqual(Object.keys(player.toJSON()), []);

  player.generatePoints();
  t.deepEqual(Object.keys(player.toJSON()), ['points']);

  player.generateSecrets();
  t.deepEqual(Object.keys(player.toJSON()), ['points', 'secretHashes']);
});
