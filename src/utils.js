import BigInt from 'bn.js';
import crypto from 'crypto';
import * as Config from './config';

/**
 * Returns a random 32-bit integer (signed or unsigned) in the given range.
 * @param {number} min Minimum value (included).
 * @param {number} max Maximum value (excluded).
 * @returns {number}
 */
export function getRandomInt(min, max) {
  const range = max - min;
  const bitLength = 32 - Math.clz32(range);

  // Avoid number re-generation by adding an extra byte
  const byteLength = (bitLength >> 3) + 1;
  const randomRange = Math.pow(256, byteLength);

  // Get the lowest value which is not part of the equal distribution range
  const firstTooHighValue = randomRange - randomRange % range;

  let result;
  do {
    // Generate a random number with the given byte length
    result = crypto.randomBytes(byteLength).readUIntBE(0, byteLength);
  } while (
    // Ensure equal distribution
    result >= firstTooHighValue
  );

  // Place the result in the initial range and offset it by the minimum value
  return result % range + min;
}

/**
 * Returns a random BigInt in the given range.
 * @param {BigInt} min Minimum value (included).
 * @param {BigInt} max Maximum value (excluded).
 * @returns {BigInt}
 */
export function getRandomBigInt(min, max) {
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
  return result.mod(range).toRed(Config.EC.curve.red).redIAdd(min);
}

export function getRandomSecrets(amount = Config.CARDS_IN_DECK + 1) {
  return Array.from(new Array(amount), () =>
    getRandomBigInt(Config.EC.curve.one, Config.BI_RED_EC_N)
  );
}

export function getRandomPoints(amount = Config.CARDS_IN_DECK) {
  return getRandomSecrets(amount).map((secret) =>
    Config.EC.g.mul(secret.fromRed())
  );
}

/**
 * Shuffles the elements of an array.
 * @param {Object[]} array Array to be shuffled.
 * @returns {Object[]}
 */
export function shuffleArray(array) {
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
