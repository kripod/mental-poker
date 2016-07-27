import Config from './config';
import { InvalidCardValueError } from './errors';

/**
 * An immutable object which represents a card of a French deck.
 */
export default class Card {
  /**
   * Numeric ID of the card.
   */
  id: number;

  cachedRank: string;
  cachedSuit: string;

  /**
   * Rank of the card, represented by its shorthand.
   */
  get rank(): string {
    if (!this.cachedRank) {
      this.cachedRank = Config.cardRanks[this.id % Config.cardRanks.length];
    }

    return this.cachedRank;
  }

  /**
   * Suit of the card, represented by its shorthand.
   */
  get suit(): string {
    if (!this.cachedSuit) {
      this.cachedSuit = Config.cardSuits[
        Math.floor(this.id / Config.cardRanks.length)
      ];
    }

    return this.cachedSuit;
  }

  constructor(value: string | number) {
    if (typeof value === 'string') {
      if (value.length < 2) {
        throw new InvalidCardValueError(value);
      }

      const rank = value.substring(0, value.length - 1);
      const rankIndex = Config.cardRanks.indexOf(rank);
      if (rankIndex < 0) {
        throw new InvalidCardValueError(value);
      }
      this.cachedRank = rank;

      const suit = value[value.length - 1];
      const suitIndex = Config.cardSuits.indexOf(suit);
      if (suitIndex < 0) {
        throw new InvalidCardValueError(value);
      }
      this.cachedSuit = suit;

      this.id = rankIndex + (suitIndex * Config.cardRanks.length);
    } else if (Number.isInteger(value)) {
      if (value < 0 || value >= Config.cardsInDeck) {
        throw new InvalidCardValueError(value);
      }

      this.id = value;
    } else {
      throw new InvalidCardValueError(value);
    }
  }

  toString(): string {
    return this.rank + this.suit;
  }
}
