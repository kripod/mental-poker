/**
 * Creates a new configuration object.
 * @param {number} cardCount Amount of cards in a deck.
 * @returns {Object} A configuration object.
 */
export const createConfig = (cardCount = 52) => {
  if (cardCount < 2 || !Number.isSafeInteger(cardCount)) {
    throw new RangeError('The value of cardCount must be a safe integer not less than 2');
  }

  return {
    cardCount,
  };
};
