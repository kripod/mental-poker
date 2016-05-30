export default class Game {
  deckOriginal;
  deckEncrypted;

  constructor(deckOriginal) {
    this.deckOriginal = deckOriginal;
  }

  drawCard(index, secrets) {
    const p1 = this.deckEncrypted.decryptSingle(index, secrets);

    for (let i = this.deckOriginal.points.length - 1; i >= 0; --i) {
      const p2 = this.deckOriginal.points[i];
      if (p2.eq(p1)) {
        return i;
      }
    }

    return -1;
  }
}
