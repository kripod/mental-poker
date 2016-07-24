import { ec as EllipticCurve } from 'elliptic';

export default class Config {
  static cachedEcAlgorithm;
  static ec;
  static ecRedN;

  static hashAlgorithm = 'sha256';
  static gameType = 'standard';

  static cardRanks = [
    '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A',
  ];
  static cardSuits = ['c', 'd', 'h', 's'];
  static cardsInDeck = Config.cardRanks.length * Config.cardSuits.length;

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
