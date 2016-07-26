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
  // Verify secrets by their corresponding hashes
  const player = new Player().generateSecrets();
  const secrets = player.secrets;
  player.secrets = new Array(Config.cardsInDeck + 1);
  secrets.forEach((secret, i) => { t.true(player.addSecret(i, secret)); });

  // Simulate using an invalid hash
  player.secrets[0] = null;
  player.secretHashes[0] = null;
  t.false(player.addSecret(0, secrets[0]));
});

test('serialization', (t) => {
  const player = new Player();
  t.deepEqual(Object.keys(player.toJSON()), []);

  player.generatePoints();
  t.deepEqual(Object.keys(player.toJSON()), ['points']);

  player.generateSecrets();
  t.deepEqual(Object.keys(player.toJSON()), ['points', 'secretHashes']);
});
