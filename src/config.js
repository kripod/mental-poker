import { ec as EllipticCurve } from 'elliptic';

export const EC = new EllipticCurve('secp256k1');

export const BI_RED_EC_N = EC.n.toRed(EC.curve.red);

export const CARDS_IN_DECK = 52;
