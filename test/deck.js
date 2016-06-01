import test from 'ava';
import Deck from './../src/deck';
import Player from './../src/player';

const player = new Player();
const deckOriginal = new Deck(player.points);

test('shuffle', (t) => {
  const deckShuffled = deckOriginal.shuffle(player.randomizer);

  // Check immutability
  t.not(deckShuffled, deckOriginal);

  // Check whether the result's length is correct
  t.is(deckShuffled.points.length, deckOriginal.points.length);
});

test('encryption and decryption with a single secret', (t) => {
  const lastSecret = player.secrets[player.secrets.length - 1];
  const deckEncrypted = deckOriginal.encryptAll(lastSecret);
  const deckDecrypted = deckEncrypted.decryptAll(lastSecret);

  // Check immutability
  t.not(deckEncrypted, deckOriginal);
  t.not(deckDecrypted, deckEncrypted);

  // Check whether encryption and decryption are symmetric operations
  t.deepEqual(
    deckDecrypted.points.map((point) => point.x.toString(16)),
    deckOriginal.points.map((point) => point.x.toString(16))
  );
});

test('encryption and decryption with multiple secrets', (t) => {
  const deckEncrypted = deckOriginal.encryptAll(player.secrets);
  const deckDecrypted = new Deck(player.secrets.slice(0, -1).map((secret, i) =>
    deckEncrypted.decryptSingle(i, [secret])
  ));

  // Check immutability
  t.not(deckEncrypted, deckOriginal);

  // Check whether encryption and decryption are symmetric operations
  t.deepEqual(
    deckDecrypted.points.map((point) => point.x.toString(16)),
    deckOriginal.points.map((point) => point.x.toString(16))
  );
});
