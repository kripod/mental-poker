/**
 * Represents a bet type.
 * @enum {number}
 */
const BetType = {
  /**
   * Refuse to make a bet.
   */
  CHECK: 1,

  /**
   * Match a bet or a raise.
   */
  CALL: 2,

  /**
   * Make the first voluntary bet in a round or increase the size of an existing
   * bet in the same round.
   */
  RAISE: 3,

  /**
   * Refuse to match a bet or a raise.
   */
  FOLD: 4,
};

export default BetType;
