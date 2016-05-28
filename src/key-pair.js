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
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }
}
