import BetType from './enums/bet-type';
import type { BetJSON, BetTypeValue } from './interfaces';

/**
 * An immutable object which represents a bet made by a player during a game.
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
