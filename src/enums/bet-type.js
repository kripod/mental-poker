// @flow

import type { BetTypeValue } from '../interfaces';

/**
 * Represents a bet type.
 * @enum {number}
 */
const BetType = {
  /**
   * Refuse to match a bet or a raise.
   */
  FOLD: 0,

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

  toString(value: BetTypeValue): string {
    switch (value) {
      case BetType.CHECK:
        return 'check';
      case BetType.CALL:
        return 'call';
      case BetType.RAISE:
        return 'raise';
      default:
        return 'fold';
    }
  },

  fromString(value: string): BetTypeValue {
    switch (value) {
      case 'check':
        return BetType.CHECK;
      case 'call':
        return BetType.CALL;
      case 'raise':
        return BetType.RAISE;
      default:
        return BetType.FOLD;
    }
  },
};

export default BetType;
