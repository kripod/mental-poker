const Config = require('./config');

/**
 * An immutable object which represents a card of a French deck.
 */
class Card {
  /**
   * Numeric ID of the card.
   * @type {number}
   * @member id
   * @memberof Card
   */

  /**
   * Rank of the card, represented by its shorthand.
   * @returns {string}
   * @member rank
   * @memberof Card
   */

  /**
   * Suit of the card, represented by its shorthand.
   * @returns {string}
   * @member suit
   * @memberof Card
   */

  constructor(value) {
    if (typeof value === 'string') {
      if (value.length < 2) {
        // TODO: Throw exception
        return;
      }

      this.rank = value.substring(0, value.length - 1);
      const rankIndex = Config.cardRanks.indexOf(this.rank);
      if (rankIndex < 0) {
        // TODO: Throw exception
        return;
      }

      this.suit = value[value.length - 1];
      const suitIndex = Config.cardSuits.indexOf(this.suit);
      if (suitIndex < 0) {
        // TODO: Throw exception
        return;
      }

      this.id = rankIndex + (suitIndex * Config.cardRanks.length);
    } else if (Number.isInteger(value)) {
      if (value < 0 || value >= Config.cardsInDeck) {
        // TODO: Throw exception
        return;
      }

      this.id = value;
      this.rank = Config.cardRanks.indexOf(this.id % Config.cardRanks.length);
      this.suit = Config.cardSuits.indexOf(
        Math.floor(this.id / Config.cardRanks.length)
      );
    }
  }

  toString() {
    return this.rank + this.suit;
  }
}

module.exports = Card;
