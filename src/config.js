import { ec as EllipticCurve } from 'elliptic';

export const BUFFER_DIGEST_ENCODING = 'base64';

export const CARDS_IN_DECK = 52;
export const CARDS_IN_HAND = 2;
export const CARDS_ON_TABLE_IN_ROUNDS = [0, 3, 4, 5];

export const EC = new EllipticCurve('secp256k1');

export const INT32_MIN_VALUE = -2147483648;
export const UINT32_MAX_VALUE = 4294967295;
export const UINT32_RANGE = UINT32_MAX_VALUE + 1;
