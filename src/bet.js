// @flow

import BetType from './enums/bet-type';
import type { BetJSON, BetTypeValue } from './interfaces';

/**
 * An immutable object which represents a bet made by a player during a game.
 * @class Bet
 */
export default class Bet {
  /**
   * Type of the bet.
   */
  type: BetTypeValue;

  /**
   * Amount of the bet.
   */
  amount: number;

  /**
   * @param {BetTypeValue} $0.type Type of the bet.
   * @param {number} [$0.amount] Amount of the bet.
   */
  constructor({ type, amount = 0 }: { type: BetTypeValue, amount?: number }) {
    this.type = type;
    this.amount = amount;
  }

  toJSON(): BetJSON {
    return {
      type: BetType.toString(this.type),
      amount: this.amount,
    };
  }
}
