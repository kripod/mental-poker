import test from 'ava';
import { publicKeyCombine, publicKeyVerify } from 'secp256k1';
import {
  createDeck,
  decryptDeck,
  encryptDeck,
  isDeckDuplicateFree,
} from './deck';
import { createPublicKey, randomPrivateKey } from './key';

const DEFAULT_PLAYER_COUNT = 4;
const DEFAULT_CARD_COUNT = 52;

const createDuplicateFreeDeck = (cardCount = DEFAULT_CARD_COUNT) => {
  const publicKeys = Array(...Array(cardCount)).map(() => createPublicKey());

  return new Set(publicKeys.map(publicKey => `${publicKey}`)).size === cardCount
    ? publicKeys
    : createDuplicateFreeDeck(cardCount);
};

test('createDeck', (t) => {
  // eslint-disable-next-line max-len
  const cardCodewordFragmentsOfPlayers = Array(...Array(DEFAULT_PLAYER_COUNT)).map(() => Array(...Array(DEFAULT_CARD_COUNT)).map(() => createPublicKey()));
  const deck = createDeck(cardCodewordFragmentsOfPlayers);

  t.is(deck.length, DEFAULT_CARD_COUNT);
  t.deepEqual(
    deck,
    cardCodewordFragmentsOfPlayers.reduce((prevCodewordFragments, currCodewordFragments) =>
      currCodewordFragments.map((currCodewordFragment, i) =>
        publicKeyCombine([currCodewordFragment, prevCodewordFragments[i]]))),
  );
});

test('isDeckDuplicateFree', (t) => {
  const deck = createDuplicateFreeDeck();

  t.true(isDeckDuplicateFree(deck));

  // eslint-disable-next-line prefer-destructuring
  deck[0] = deck.slice(-1)[0];
  t.false(isDeckDuplicateFree(deck));
});

test('encryptDeck/decryptDeck (single key)', (t) => {
  const deckOriginal = createDuplicateFreeDeck();
  const privateKey = randomPrivateKey();

  const deckEncrypted = encryptDeck(deckOriginal, privateKey);
  t.is(deckEncrypted.length, deckOriginal.length);
  deckEncrypted.forEach(card => t.true(publicKeyVerify(card)));

  const deckDecrypted = decryptDeck(deckEncrypted, privateKey);
  t.is(deckDecrypted.length, deckEncrypted.length);
  deckDecrypted.forEach(card => t.true(publicKeyVerify(card)));

  t.deepEqual(deckDecrypted, deckOriginal);
});

test('encryptDeck (multiple keys)', (t) => {
  const deckOriginal = createDuplicateFreeDeck();
  const privateKeys = Array(...Array(DEFAULT_CARD_COUNT)).map(() =>
    randomPrivateKey());

  const deckEncrypted = encryptDeck(deckOriginal, privateKeys);
  t.is(deckEncrypted.length, deckOriginal.length);
  deckEncrypted.forEach(card => t.true(publicKeyVerify(card)));

  const deckDecrypted = decryptDeck(deckEncrypted, privateKeys);
  t.is(deckDecrypted.length, deckEncrypted.length);
  deckDecrypted.forEach(card => t.true(publicKeyVerify(card)));

  t.deepEqual(deckDecrypted, deckOriginal);
});
