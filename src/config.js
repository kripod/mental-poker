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

Config.gameType = 'standard';

Config.cardRanks = [
  '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A',
];
Config.cardSuits = ['c', 'd', 'h', 's'];
Config.cardsInDeck = Config.cardRanks.length * Config.cardSuits.length;

module.exports = Config;
