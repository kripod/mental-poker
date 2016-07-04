const Utils = require('./utils');

class Player {
  get secretHashes() {
    if (!this.cachedSecretHashes) {
      this.cachedSecretHashes = Utils.getSecretHashes(this.secrets);
    }

    return this.cachedSecretHashes;
  }

  constructor({ points, secrets } = {}) {
    if (points || secrets) {
      // None of the properties shall be auto-generated
      this.points = points || [];
      this.secrets = secrets || [];
    } else {
      // Properties should be auto-generated
      this.points = Utils.getRandomPoints();
      this.secrets = Utils.getRandomSecrets();
    }

    this.cardsInHand = [];
  }

  shuffleDeck(
    deck = this.deckSequence ?
      this.deckSequence[this.deckSequence.length - 1] :
      null
  ) {
    // Improve the accessibility of secrets later by using the last one now
    const lastSecret = this.secrets[this.secrets.length - 1];

    // Shuffle the deck and then encrypt it to avoid data leaks
    return deck.shuffle().encrypt(lastSecret);
  }

  lockDeck(
    deck = this.deckSequence ?
      this.deckSequence[this.deckSequence.length - 1] :
      null
  ) {
    const lastSecret = this.secrets[this.secrets.length - 1];

    // Remove the shuffle encryption and then lock each card one by one
    return deck.decrypt(lastSecret).lock(this.secrets);
  }
}

module.exports = Player;
