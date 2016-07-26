import BigInt from 'bn.js';
import crypto from 'crypto';
import Config from './config';
import type { Point, PointJSON } from './interfaces';

/**
 * Returns a random 32-bit integer (signed or unsigned) in the given range.
 * @param {number} min Minimum value (included).
 * @param {number} max Maximum value (excluded).
 * @returns {number}
 */
export function getRandomInt(min: number, max: number): number {
  const range = max - min;
  const bitLength = 32 - Math.clz32(range);

  // Avoid number re-generation by adding an extra byte
  const byteLength = (bitLength >> 3) + 1;
  const randomRange = Math.pow(256, byteLength);

  // Get the lowest value which is not part of the equal distribution range
  const firstTooHighValue = randomRange - (randomRange % range);

  let result;
  do {
    // Generate a random number with the given byte length
    result = crypto.randomBytes(byteLength).readUIntBE(0, byteLength);
  } while (
    // Ensure equal distribution
    result >= firstTooHighValue
  );

  // Place the result in the initial range and offset it by the minimum value
  return (result % range) + min;
}

/**
 * Returns a random BigInt in the given range.
 * @param {BigInt} min Minimum value (included).
 * @param {BigInt} max Maximum value (excluded).
 * @returns {BigInt}
 */
export function getRandomBigInt(min: BigInt, max: BigInt): BigInt {
  const range = max.redSub(min);

  // Avoid number re-generation by adding an extra byte
  const byteLength = range.byteLength() + 1;
  const randomRange = new BigInt(256).ishln(range.byteLength() << 3);

  // Get the lowest value which is not part of the equal distribution range
  const firstTooHighValue = randomRange.sub(randomRange.mod(range));

  let result;
  do {
    // Generate a random number with the given byte length
    result = new BigInt(crypto.randomBytes(byteLength));
  } while (
    // Ensure equal distribution
    result.gte(firstTooHighValue)
  );

  // Place the result in the initial range and offset it by the minimum value
  return result.mod(range).toRed(Config.ec.curve.red).redIAdd(min);
}

export function getRandomSecrets(
  amount: number = Config.cardsInDeck + 1
): BigInt[] {
  return Array.from(new Array(amount), (): BigInt =>
    getRandomBigInt(Config.ec.curve.one, Config.ecRedN)
  );
}

export function getRandomPoints(amount: number = Config.cardsInDeck): Point[] {
  return getRandomSecrets(amount).map((secret: BigInt): Point =>
    Config.ec.g.mul(secret.fromRed())
  );
}

export function getSecretHash(
  secret: BigInt,
  algorithm: string = Config.hashAlgorithm
): string {
  return crypto.createHash(algorithm)
    .update(secret.toString(16, 2))
    .digest('hex');
}

/**
 * Shuffles the elements of an array.
 * @param {T[]} array Array to be shuffled.
 * @returns {T[]}
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];

  // Perform Durstenfeld shuffle
  for (let i = array.length - 1; i > 0; --i) {
    // Generate a random integer in [0, i] deterministically
    const j = getRandomInt(0, i);

    // Swap result[i] and result[j]
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

/**
 * Converts a point into a JSON-serializable object.
 * @param {Point} point Point to be converted.
 * @returns {PointJSON}
 */
export function pointToJSON(point: Point): PointJSON {
  return {
    x: point.x.toString(16, 2),
    y: point.y.toString(16, 2),
  };
}

/**
 * Sorts the given points in ascending order.
 * @param {Point[]} points Points to be sorted.
 * @returns {Point[]}
 */
export function sortPoints(points: Point[]): Point[] {
  return points.sort((p1: Point, p2: Point): number => {
    const xCmp = p1.x.cmp(p2.x);
    return xCmp === 0 ? p1.y.cmp(p2.y) : xCmp;
  });
}
