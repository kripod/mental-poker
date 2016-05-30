import { ec as EllipticCurve } from 'elliptic';

export const BUFFER_DIGEST_ENCODING = 'base64';

export const CARDS_IN_DECK = 52;
export const CARDS_IN_HAND = 2;
export const CARDS_ON_TABLE_IN_ROUNDS = [0, 3, 4, 5];

export const EC = new EllipticCurve('secp256k1');
