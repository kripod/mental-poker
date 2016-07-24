import { ec as EllipticCurve } from 'elliptic';

export default class Config {
  static cachedEcAlgorithm: string;
  static ec: EllipticCurve;
  static ecRedN: Object;

  static hashAlgorithm: string = 'sha256';
  static gameType: string = 'standard';

  static cardRanks: string[] = [
    '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A',
  ];
  static cardSuits: string[] = ['c', 'd', 'h', 's'];
  static cardsInDeck: number =
    Config.cardRanks.length * Config.cardSuits.length;

  static get ecAlgorithm(): string {
    return this.cachedEcAlgorithm;
  }

  static set ecAlgorithm(value): void {
    this.cachedEcAlgorithm = value;

    this.ec = new EllipticCurve(value);
    this.ecRedN = this.ec.n.toRed(this.ec.curve.red);
  }
}

Config.ecAlgorithm = 'secp256k1';
