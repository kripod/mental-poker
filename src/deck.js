const Config = require('./config');
const Utils = require('./utils');

class Deck {
  constructor(points) {
    this.points = points;
  }

  /**
   * Encrypts all of the deck's points with the given secret.
   * @param {BigInt} secret Secret to encrypt with.
   * @returns {Deck}
   */
  encrypt(secret) {
    const bi = secret.fromRed();
    return new Deck(this.points.map((point) => point.mul(bi)));
  }

  /**
   * Decrypts all of the deck's points with the given secret.
   * @param {BigInt} secret Secret to be used for decryption.
   * @returns {Deck}
   */
  decrypt(secret) {
    const bi = secret.invm(Config.ec.n);
    return new Deck(this.points.map((point) => point.mul(bi)));
  }

  /**
   * Shuffles all of the deck's points.
   * @returns {Deck}
   */
  shuffle() {
    return new Deck(Utils.shuffleArray(this.points));
  }

  /**
   * Locks all of the deck's points with the given secrets.
   * @param {BigInt[]} secrets Secrets to lock with.
   * @returns {Deck}
   */
  lock(secrets) {
    return new Deck(
      this.points.map((point, i) => point.mul(secrets[i].fromRed()))
    );
  }

  /**
   * Unlocks a single point by using multiple secrets.
   * @param {number} index Index of the card to be unlocked.
   * @param {BigInt[]} secrets Secrets to be used for unlocking.
   * @returns {Point}
   */
  unlockSingle(index, secrets) {
    let point = this.points[index];

    for (const secret of secrets) {
      point = point.mul(secret.invm(Config.ec.n));
    }

    return point;
  }
}

module.exports = Deck;
