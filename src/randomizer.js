import BigInt from 'bn.js';
import crypto from 'crypto';
import eccrypto from 'eccrypto';
import random from 'random-js';
import KeyPair from './key-pair';

/**
 * A randomization engine which can be made deterministic by using a
 * custom-seeded engine.
 */
export default class Randomizer {
  /**
   * Engine to be used for randomization.
   * @type {Object}
   * @memberof {Randomizer}
   */
  engine;

  /**
   * Returns a random public-private key pair.
   * @returns {KeyPair}
   */
  static getKeyPair() {
    const privateKey = crypto.randomBytes(32);
    const publicKey = eccrypto.getPublic(privateKey);

    return new KeyPair(publicKey, privateKey);
  }

  constructor(engine) {
    this.engine = engine;
  }

  /**
   * Returns a random BigInt in the given range.
   * @param {BigInt} min Minimum value (included).
   * @param {BigInt} max Maximum value (excluded).
   * @returns {BigInt}
   */
  getBigInt(min, max) {
    const range = max.sub(min);
    const halfBytesNeeded = Math.ceil(range.bitLength() / 4);

    let bi;
    do {
      // Generate a random hex value with the length of the range
      const hex = random.hex()(this.engine, halfBytesNeeded);

      // Offset the result by the minimum value
      bi = new BigInt(hex, 16).add(min);
    } while (bi.gte(max));

    // Return the result which satisfies the given range
    return bi;
  }

  /**
   * Shuffles the elements of an array.
   * @param {Object[]} array Array to be shuffled.
   * @returns {Object[]}
   */
  shuffleArray(array) {
    const result = [...array];

    // Perform Durstenfeld shuffle
    for (let i = array.length - 1; i > 0; --i) {
      // Generate a random integer in [0, i] deterministically
      const j = random.integer(0, i)(this.engine);

      // Swap result[i] and result[j]
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
  }
}
