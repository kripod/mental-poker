export default class Deck {
  points;

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
    const bi = secret.redInvm().fromRed();
    return new Deck(this.points.map((point) => point.mul(bi)));
  }

  /**
   * Shuffles all of the deck's points with the given randomization engine.
   * @param {Randomizer} randomizer Randomization engine to shuffle with.
   * @returns {Deck}
   */
  shuffle(randomizer) {
    return new Deck(randomizer.shuffleArray(this.points));
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
   * @returns {elliptic.curve.base.BasePoint}
   */
  unlockSingle(index, secrets) {
    let point = this.points[index];

    for (const secret of secrets) {
      point = point.mul(secret.redInvm().fromRed());
    }

    return point;
  }
}
