import ecurve from 'ecurve';
import { BigInteger as BigInt } from 'jsbn';

export const BUFFER_DIGEST_ENCODING = 'base64';

export const CARDS_IN_DECK = 52;
export const CARDS_IN_HAND = 2;
export const CARDS_ON_TABLE_IN_ROUNDS = [0, 3, 4, 5];

export const EC = ecurve.getCurveByName('secp256k1');

EC.n = new BigInt(EC.n.toString(16), 16);
