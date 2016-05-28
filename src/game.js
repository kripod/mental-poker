export default class Game {
  deckOriginal;
  deckEncrypted;

  constructor(deckOriginal) {
    this.deckOriginal = deckOriginal;
  }

  drawCard(index, secrets) {
    return this.deckOriginal.points.map((point) => point.toString()).indexOf(
      this.deckEncrypted.decryptSingle(index, secrets).toString()
    );
  }
}
