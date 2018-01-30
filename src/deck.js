import {
  privateKeyModInverse,
  publicKeyCombine,
  publicKeyTweakMul,
} from 'secp256k1';

/**
 * Transposes an array, switching the row and column indices of it.
 * @param {*[]} array Array to be transposed.
 * @returns {*[]} The transposed array.
 */
const transpose = array =>
  array[0].map((v, columnIndex) => array.map(row => row[columnIndex]));

/**
 * Creates a new deck of cards from the given codeword fragments.
 * @param {(Buffer[])[]} cardCodewordFragmentsOfPlayers Card codeword fragments of each player,
 * represented as arrays of public keys. Players shall contribute equal amounts of codeword
 * fragments through a commitment scheme, to prevent malicious players from manipulating the
 * generated codewords in their own favor.
 * @param {boolean} compressed Determines whether the resulting public keys should be compressed.
 * @returns {Buffer[]} An array of public keys, each representing a card as a codeword.
 */
export const createDeck = (
  cardCodewordFragmentsOfPlayers,
  compressed = true,
) => {
  if (cardCodewordFragmentsOfPlayers.length < 2) {
    throw new Error('Card fragments of at least 2 players are required');
  }

  cardCodewordFragmentsOfPlayers.reduce((prevCodewordFragments, currCodewordFragments) => {
    if (prevCodewordFragments.length !== currCodewordFragments.length) {
      throw new Error('The amount of card fragments contributed by each player shall be the same');
    }

    return currCodewordFragments;
  });

  return transpose(cardCodewordFragmentsOfPlayers).map(codewordFragments =>
    publicKeyCombine(codewordFragments, compressed));
};

/**
 * Checks whether a deck is duplicate-free.
 * @param {Buffer[]} deck Deck to be checked.
 * @returns {boolean} True if the deck is duplicate-free, false otherwise.
 */
export const isDeckDuplicateFree = deck =>
  // TODO: Consider optimizing this
  new Set(deck.map(card => card.toString('hex'))).size === deck.length;

/**
 * Encrypts every card of a deck using the given private key(s).
 * @param {Buffer[]} deck Deck to be encrypted.
 * @param {Buffer|Buffer[]} privateKeys Private key(s) to encrypt the deck with. If multiple keys
 * are specified, each of them will encrypt the card at its corresponding index.
 * @param {boolean} compressed Determines whether the resulting public keys should be compressed.
 * @returns {Buffer[]} An array of public keys, each representing a card of the deck.
 */
export const encryptDeck = (deck, privateKeys, compressed = true) =>
  // TODO: Check the length of privateKeys
  (Array.isArray(privateKeys)
    ? deck.map((card, i) => publicKeyTweakMul(card, privateKeys[i], compressed))
    : deck.map(card => publicKeyTweakMul(card, privateKeys, compressed)));

/**
 * Decrypts every card of a deck using the given private key(s).
 * @param {Buffer[]} deck Deck to be decrypted.
 * @param {Buffer|Buffer[]} privateKeys Private key(s) to decrypt the deck with. If multiple keys
 * are specified, each of them will decrypt the card at its corresponding index.
 * @param {boolean} compressed Determines whether the resulting public keys should be compressed.
 * @returns {Buffer[]} An array of public keys, each representing a card of the deck.
 */
export const decryptDeck = (deck, privateKeys, compressed = true) => {
  // TODO: Check the length of privateKeys
  if (Array.isArray(privateKeys)) {
    return deck.map((card, i) =>
      publicKeyTweakMul(card, privateKeyModInverse(privateKeys[i]), compressed));
  }

  const modInverseOfPrivateKey = privateKeyModInverse(privateKeys);
  return deck.map(card =>
    publicKeyTweakMul(card, modInverseOfPrivateKey, compressed));
};

/**
 * Decrypts a single card using the given private keys.
 * @param {Buffer} card Card to be decrypted.
 * @param {Buffer[]} privateKeys Private keys to decrypt the card with, one by one, regardless of
 * order (as elliptic curve point multiplication, on which encryption and decryption are based on,
 * is a commutative operation).
 * @param {boolean} compressed Determines whether the resulting public key should be compressed.
 * @returns {Buffer} A public key, representing a card which can be mapped directly to a card
 * codeword if the supplied private keys were correct.
 */
export const decryptCard = (card, privateKeys, compressed = true) =>
  privateKeys.reduce(
    (prevCard, currCard) =>
      publicKeyTweakMul(prevCard, privateKeyModInverse(currCard), compressed),
    card,
  );
