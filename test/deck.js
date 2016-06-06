import test from 'ava';
import { Deck, Player } from './../src';

const player = new Player();
const deckOriginal = new Deck(player.points);

test('shuffle', (t) => {
  const deckShuffled = deckOriginal.shuffle();

  // Check immutability
  t.not(deckShuffled, deckOriginal);

  // Check whether the result's length is correct
  t.is(deckShuffled.points.length, deckOriginal.points.length);
});

test('encryption and decryption', (t) => {
  const lastSecret = player.secrets[player.secrets.length - 1];
  const deckEncrypted = deckOriginal.encrypt(lastSecret);
  const deckDecrypted = deckEncrypted.decrypt(lastSecret);

  // Check immutability
  t.not(deckEncrypted, deckOriginal);
  t.not(deckDecrypted, deckEncrypted);

  // Check whether encryption and decryption are symmetric operations
  t.deepEqual(
    deckDecrypted.points.map((point) => point.x.toString(16)),
    deckOriginal.points.map((point) => point.x.toString(16))
  );
});

test('locking and unlocking', (t) => {
  const deckLocked = deckOriginal.lock(player.secrets);
  const deckUnlocked = new Deck(player.secrets.slice(0, -1).map((secret, i) =>
    deckLocked.unlockSingle(i, [secret])
  ));

  // Check immutability
  t.not(deckLocked, deckOriginal);

  // Check whether encryption and decryption are symmetric operations
  t.deepEqual(
    deckUnlocked.points.map((point) => point.x.toString(16)),
    deckOriginal.points.map((point) => point.x.toString(16))
  );
});
