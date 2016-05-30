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
   * @param {BN|BN[]} secret Secret(s) to encrypt with.
   * @returns {Deck}
   */
  encryptAll(secret) {
    if (Array.isArray(secret)) {
      return new Deck(this.points.map((point, i) => point.mul(secret[i])));
    }

    return new Deck(this.points.map((point) => point.mul(secret)));
  }

  /**
   * Decrypts all of the deck's points using the given secret(s).
   * @param {BN|BN[]} secret Secret(s) to be used for decryption.
   * @returns {Deck}
   */
  decryptAll(secret) {
    if (Array.isArray(secret)) {
      return new Deck(this.points.map(
        (point, i) => point.mul(secret[i].invm(Config.EC.n))
      ));
    }

    const bi = secret.invm(Config.EC.n);
    return new Deck(this.points.map((point) => point.mul(bi)));
  }

  /**
   * Decrypts a single point by using multiple secrets.
   * @param {number} index Index of the card to be decrypted.
   * @param {BN[]} secrets Secrets to be used for decryption.
   * @returns {elliptic.curve.base.BasePoint}
   */
  decryptSingle(index, secrets) {
    let point = this.points[index];

    for (const secret of secrets) {
      point = point.mul(secret.invm(Config.EC.n));
    }

    return point;
  }
}
