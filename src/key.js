import { randomBytes } from 'crypto';
import { privateKeyVerify, publicKeyConvert, publicKeyCreate } from 'secp256k1';

/**
 * Generates a private key from cryptographically strong pseudo-random data.
 * @returns {Buffer} A random private key.
 */
export const randomPrivateKey = () => {
  let privateKey;

  do {
    privateKey = randomBytes(32);
  } while (!privateKeyVerify(privateKey));

  return privateKey;
};

/**
 * Creates a new public key.
 * @param {Buffer} privateKey Private key to derive the public key from.
 * @param {boolean} compressed Determines whether the resulting public key should be compressed.
 * @returns {Buffer} A public key derived from the given private key.
 */
export const createPublicKey = (
  privateKey = randomPrivateKey(),
  compressed = true,
) => publicKeyCreate(privateKey, compressed);

/**
 * Creates a new key pair, which consists of a public key and a private key.
 * @param {Buffer} privateKey Private key to derive the public key from.
 * @param {boolean} compressed Determines whether the resulting public key should be compressed.
 * @returns {Object} A key pair object derived from the given private key.
 */
export const createKeyPair = (
  privateKey = randomPrivateKey(),
  compressed = true,
) => ({
  publicKey: publicKeyCreate(privateKey, compressed),
  privateKey,
});

/**
 * Verifies a key pair.
 * @param {Object} keyPair Key pair to be verified.
 * @param {Buffer} keyPair.publicKey Public key to be verified.
 * @param {Buffer} keyPair.privateKey Private key on which the verification should be based.
 * @returns {boolean} True if the key pair is valid, false otherwise.
 */
export const verifyKeyPair = ({ publicKey, privateKey }) =>
  publicKeyCreate(privateKey).equals(publicKeyConvert(publicKey));
