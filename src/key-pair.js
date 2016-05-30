import * as Config from './config';

/**
 * Represents an ECIES public-private key pair.
 */
export default class KeyPair {
  /**
   * Public key.
   * @type {Buffer}
   * @memberof {KeyPair}
   */
  publicKey;

  /**
   * Private key.
   * @type {Buffer}
   * @memberof {KeyPair}
   */
  privateKey;

  constructor(publicKey, privateKey) {
    this.publicKey = typeof publicKey === 'string' ?
      Buffer.from(publicKey, Config.BUFFER_DIGEST_ENCODING) :
      publicKey;

    this.privateKey = typeof privateKey === 'string' ?
      Buffer.from(privateKey, Config.BUFFER_DIGEST_ENCODING) :
      privateKey;
  }
}
