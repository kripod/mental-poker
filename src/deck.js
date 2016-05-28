import { BigInteger as BigInt } from 'jsbn';
import * as Config from './config';

export default class Deck {
  points;

  constructor(points) {
    this.points = points;
  }

  /**
   * Shuffles the deck's points with the given randomization engine.
   * @param {Randomizer} randomizer Randomization engine to be used.
   * @returns {Deck}
   */
  shuffle(randomizer) {
    return new Deck(randomizer.shuffleArray(this.points));
  }

  /**
   * Encrypts all of the deck's points with the given secret(s).
   * @param {BigInt|BigInt[]} secret Secret(s) to encrypt with.
   * @returns {Deck}
   */
  encryptAll(secret) {
    if (Array.isArray(secret)) {
      return new Deck(this.points.map((point, i) => point.multiply(secret[i])));
    }

    return new Deck(this.points.map((point) => point.multiply(secret)));
  }

  /**
   * Decrypts all of the deck's points using the given secret(s).
   * @param {BigInt|BigInt[]} secret Secret(s) to be used for decryption.
   * @returns {Deck}
   */
  decryptAll(secret) {
    if (Array.isArray(secret)) {
      return new Deck(this.points.map(
        (point, i) => point.multiply(secret[i].modInverse(Config.EC.n))
      ));
    }

    const bi = secret.modInverse(Config.EC.n);
    return new Deck(this.points.map((point) => point.multiply(bi)));
  }

  /**
   * Decrypts a single point by using multiple secrets.
   * @param {number} index Index of the card to be decrypted.
   * @param {BigInt[]} secrets Secrets to be used for decryption.
   * @returns {ecurve.Point}
   */
  decryptSingle(index, secrets) {
    let point = this.points[index];

    for (const secret of secrets) {
      point = point.multiply(secret.modInverse(Config.EC.n));
    }

    return point;
  }
}
