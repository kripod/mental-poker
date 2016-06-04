import * as Config from './config';

/**
 * Represents a seed used for deterministic random number generation.
 */
export default class Seed {
  /**
   * @type {string}
   * @memberof {Seed}
   */
  value;

  static fromBuffer(buf) {
    return new this(buf.toString(Config.BUFFER_DIGEST_ENCODING));
  }

  constructor(value) {
    this.value = value;
  }
}
