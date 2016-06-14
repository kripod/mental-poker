const { ec: EllipticCurve } = require('elliptic');

class Config {
  static get ecAlgorithm() {
    return this.cachedEcAlgorithm;
  }

  static set ecAlgorithm(value) {
    this.cachedEcAlgorithm = value;

    this.ec = new EllipticCurve(value);
    this.ecRedN = this.ec.n.toRed(this.ec.curve.red);
  }
}

Config.ecAlgorithm = 'secp256k1';
Config.hashAlgorithm = 'sha256';
Config.cardsInDeck = 52;

module.exports = Config;
