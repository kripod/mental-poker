import { ec as EllipticCurve } from 'elliptic';

export const EC = new EllipticCurve('secp256k1');

export const BI_RED_CTX = EC.curve.red;
export const BI_RED_ONE = EC.curve.one;
export const BI_RED_EC_N = EC.n.toRed(BI_RED_CTX);

export const BUFFER_DIGEST_ENCODING = 'base64';

export const CARDS_IN_DECK = 52;
export const CARDS_IN_HAND = 2;
export const CARDS_ON_TABLE_IN_ROUNDS = [0, 3, 4, 5];

export const INT32_MIN_VALUE = -(2 ** 31);
export const INT32_RANGE = 2 ** 32;
export const UINT32_MAX_VALUE = INT32_RANGE - 1;
