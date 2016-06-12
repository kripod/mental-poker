import * as Utils from './utils';

export default class Player {
  points;
  secrets;

  cardsInHand;

  constructor({ points, secrets, cardsInHand = [] } = {}) {
    if (points) {
      // None of the properties shall be auto-generated
      this.points = points;
      this.secrets = secrets;
    } else {
      // Missing properties should be auto-generated
      this.points = Utils.getRandomPoints();
      this.secrets = Utils.getRandomSecrets();
    }

    this.cardsInHand = cardsInHand;
  }

  shuffleDeck(deck) {
    // Improve the accessibility of secrets later by using the last one now
    const lastSecret = this.secrets[this.secrets.length - 1];

    // Shuffle the deck and then encrypt it to avoid data leaks
    return deck.shuffle().encrypt(lastSecret);
  }

  lockDeck(deck) {
    const lastSecret = this.secrets[this.secrets.length - 1];

    // Remove the shuffle encryption and then lock each card one by one
    return deck.decrypt(lastSecret).lock(this.secrets);
  }

  getRandomCardIndex(game = this) {
    const unownedCardIndexes = game.unownedCardIndexes;

    // Return the index of an unowned card
    return unownedCardIndexes[
      Utils.getRandomInt(0, unownedCardIndexes.length)
    ];
  }
}
