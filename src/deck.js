import BigInt from 'bn.js';
import Config from './config';
import * as Utils from './utils';

/**
 * An immutable object which represents a deck of cards.
 */
export default class Deck {
  points: Object[];

  constructor(points: Object[]) {
    this.points = points;
  }

  /**
   * Encrypts all of the deck's points with the given secret.
   * @param {BigInt} secret Secret to encrypt with.
   * @returns {Deck}
   */
  encrypt(secret: BigInt): Deck {
    const bi = secret.fromRed();
    return new Deck(this.points.map((point: Object): Object => point.mul(bi)));
  }

  /**
   * Decrypts all of the deck's points with the given secret.
   * @param {BigInt} secret Secret to be used for decryption.
   * @returns {Deck}
   */
  decrypt(secret: BigInt): Deck {
    const bi = secret.invm(Config.ec.n);
    return new Deck(this.points.map((point: Object): Object => point.mul(bi)));
  }

  /**
   * Shuffles all of the deck's points.
   * @returns {Deck}
   */
  shuffle(): Deck {
    return new Deck(Utils.shuffleArray(this.points));
  }

  /**
   * Locks all of the deck's points with the given secrets.
   * @param {BigInt[]} secrets Secrets to lock with.
   * @returns {Deck}
   */
  lock(secrets: BigInt[]): Deck {
    return new Deck(
      this.points.map(
        (point: Object, i: number): Object => point.mul(secrets[i].fromRed())
      )
    );
  }

  /**
   * Unlocks a single point by using multiple secrets.
   * @param {number} index Index of the card to be unlocked.
   * @param {BigInt[]} secrets Secrets to be used for unlocking.
   * @returns {Point}
   */
  unlockSingle(index: number, secrets: BigInt[]): Object {
    let point = this.points[index];

    for (const secret of secrets) {
      point = point.mul(secret.invm(Config.ec.n));
    }

    return point;
  }

  toJSON(): Object {
    return {
      points: this.points.map((point: Object): Object => ({
        x: point.x.toString(16, 2),
        y: point.y.toString(16, 2),
      })),
    };
  }
}
