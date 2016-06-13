const { ec: EllipticCurve } = require('elliptic');

const EC = new EllipticCurve('secp256k1');
const BI_RED_EC_N = EC.n.toRed(EC.curve.red);

module.exports = {
  EC,
  BI_RED_EC_N,
  CARDS_IN_DECK: 52,
};
