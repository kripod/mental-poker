import { createPublicKey, createKeyPair } from './key';

/**
 * Creates a new player object.
 * @param {Object} config Configuration object to be used.
 * @param {Function} randomKeyPair Key pair generator function, which should return a
 * cryptographically secure random key pair on each call.
 * @param {Function} randomPublicKey Public key generator function, which should return a
 * cryptographically secure random public key on each call.
 * @returns {Object} A player object.
 */
export const createPlayer = (
  config,
  randomKeyPair = () => createKeyPair(),
  randomPublicKey = () => createPublicKey(),
) => ({
  cardCodewordFragments: Array(...Array(config.cardCount)).map(() =>
    randomPublicKey()),
  keyPairs: Array(...Array(config.cardCount + 1)).map(() => randomKeyPair()),
});
