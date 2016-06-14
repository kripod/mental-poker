const Config = require('./config');
const Deck = require('./deck');
const Player = require('./player');

class Game extends Player {
  get unownedCardIndexes() {
    return Array.from(new Array(Config.cardsInDeck), (v, i) => i)
      .filter((v) => this.ownedCardIndexes.indexOf(v) < 0);
  }

  constructor(players, deckLocked, ownedCardIndexes = []) {
    super(players[0]);

    // 3.1.1 - Points generation
    let deckPoints = [];
    do {
      for (const player of players) {
        // 3.1.1.2
        deckPoints = player.points.map((playerPoint, i) => { // eslint-disable-line
          const deckPoint = deckPoints[i];

          // Add the current player's point to the corresponding deck point
          return deckPoint ? playerPoint.add(deckPoint) : playerPoint;
        });
      }
    } while (
      // Avoid duplicate deck points
      (new Set(
        deckPoints.map((point) => point.x.toString(16))
      )).size !== deckPoints.length
    );

    this.players = players;

    this.deckOriginal = new Deck(deckPoints);
    this.deckLocked = deckLocked;
    this.ownedCardIndexes = ownedCardIndexes;

    this.cardsOnTable = [];
  }

  drawCard(index, secrets) {
    if (this.ownedCardIndexes.indexOf(index) < 0) {
      const pointUnlocked = this.deckLocked.unlockSingle(index, secrets);
      const deckPoints = this.deckOriginal.points;

      for (let i = deckPoints.length - 1; i >= 0; --i) {
        if (deckPoints[i].eq(pointUnlocked)) {
          this.ownedCardIndexes.push(index);
          return i;
        }
      }
    }

    return -1;
  }
}

module.exports = Game;
