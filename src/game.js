import Deck from './deck';

export default class Game {
  players;

  deckOriginal;
  deckEncrypted;
  ownedCardIndexes;

  constructor(players, deckEncrypted, ownedCardIndexes = []) {
    this.players = players;

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
      (new Set(deckPoints)).size !== deckPoints.length // TODO: Fix
    );

    this.deckOriginal = new Deck(deckPoints);
    this.deckEncrypted = deckEncrypted;
    this.ownedCardIndexes = ownedCardIndexes;
  }

  drawCard(index, secrets) {
    if (this.ownedCardIndexes.indexOf(index) < 0) {
      const p = this.deckEncrypted.decryptSingle(index, secrets);
      const deckPoints = this.deckOriginal.points;

      for (let i = deckPoints.length - 1; i >= 0; --i) {
        if (deckPoints[i].eq(p)) {
          this.ownedCardIndexes.push(i);
          return i;
        }
      }
    }

    return -1;
  }
}
