/**
 * An immutable object which represents a bet made by a player during a game.
 */
export default class Bet {
  /**
   * Type of the bet.
   * @type {BetType}
   */
  type: number;

  /**
   * Amount of the bet.
   */
  amount: number;

  constructor({ type, amount = 0 }) {
    this.type = type;
    this.amount = amount;
  }

  toJSON(): Object {
    return {
      type: this.type,
      amount: this.amount,
    };
  }
}
