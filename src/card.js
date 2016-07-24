import Config from './config';

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
        // TODO: Throw exception
        return;
      }

      const rank = value.substring(0, value.length - 1);
      const rankIndex = Config.cardRanks.indexOf(rank);
      if (rankIndex < 0) {
        // TODO: Throw exception
        return;
      }
      this.cachedRank = rank;

      const suit = value[value.length - 1];
      const suitIndex = Config.cardSuits.indexOf(suit);
      if (suitIndex < 0) {
        // TODO: Throw exception
        return;
      }
      this.cachedSuit = suit;

      this.id = rankIndex + (suitIndex * Config.cardRanks.length);
    } else if (Number.isInteger(value)) {
      if (value < 0 || value >= Config.cardsInDeck) {
        // TODO: Throw exception
        return;
      }

      this.id = value;
    }
  }

  toString(): string {
    return this.rank + this.suit;
  }
}
