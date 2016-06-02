import BigInt from 'bn.js';
import crypto from 'crypto';
import eccrypto from 'eccrypto';
import * as Config from './config';
import KeyPair from './key-pair';
import * as Utils from './utils';

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
   * Returns a random 32-bit integer (signed or unsigned) in the given range.
   * @param {number} min Minimum value (included).
   * @param {number} max Maximum value (excluded).
   * @returns {number}
   */
  getInt(min, max) {
    const range = max - min;

    // Get the lowest integer which is not part of the equal distribution range
    const firstTooHighValue =
      Config.INT32_RANGE - Config.INT32_RANGE % range;

    let result;
    do {
      // Generate a random 32-bit unsigned integer
      result = this.engine.int32() - Config.INT32_MIN_VALUE;
    } while (
      // Ensure equal distribution
      result >= firstTooHighValue
    );

    // Place the result in the range and offset it by the minimum value
    return result % range + min;
  }

  /**
   * Returns a random BigInt in the given range.
   * @param {BigInt} min Minimum value (included).
   * @param {BigInt} max Maximum value (excluded).
   * @returns {BigInt}
   */
  getBigInt(min, max) {
    const range = max.redSub(min);
    const completeIntsNeeded = Math.floor(range.bitLength() / 32);
    const result = [];

    // Generate the first components of the result
    for (let i = completeIntsNeeded; i > 0; --i) {
      result.push(
        ...Utils.intToByteArray(
          this.getInt(
            0,
            Config.UINT32_MAX_VALUE
          )
        )
      );
    }

    // Generate the last component of the result
    result.push(
      ...Utils.intToByteArray(
        this.getInt(
          0,
          range.mod(new BigInt(Config.UINT32_MAX_VALUE)).toNumber()
        )
      )
    );

    // Return the result which satisfies the given range
    return new BigInt(result)
      .toRed(Config.BI_RED_CTX)
      .redIAdd(min);
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
      const j = this.getInt(0, i);

      // Swap result[i] and result[j]
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
  }
}
