/**
 * An immutable object which represents a bet made by a player during a game.
 */
export default class Bet {
  /**
   * Type of the bet.
   * @type {BetType}
   */
  type;

  /**
   * Amount of the bet.
   * @type {number}
   */
  amount;

  constructor({ type, amount = 0 }) {
    this.type = type;
    this.amount = amount;
  }

  toJSON() {
    return {
      type: this.type,
      amount: this.amount,
    };
  }
}
