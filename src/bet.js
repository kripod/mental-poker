/**
 * An immutable object which represents a bet made by a player during a game.
 */
class Bet {
  /**
   * Type of the bet.
   * @type {BetType}
   * @member type
   * @memberof Bet
   */

  /**
   * Amount of the bet.
   * @type {number}
   * @member amount
   * @memberof Bet
   */

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

module.exports = Bet;
