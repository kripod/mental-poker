import seedrandom from 'seedrandom';
import * as Config from './config';
import Randomizer from './randomizer';

export default class Player {
  keyPair;
  randomizer;
  points;
  secrets;

  constructor(keyPair = Randomizer.getKeyPair(), points = null) {
    this.keyPair = keyPair;

    // Determine whether the player is self
    if (keyPair.privateKey) {
      this.randomizer = new Randomizer(
        seedrandom.xor4096(
          keyPair.privateKey.toString(Config.BUFFER_DIGEST_ENCODING)
        )
      );

      this.points = Array.from({ length: Config.CARDS_IN_DECK }).map(() =>
        Config.EC.g.mul(
          this.randomizer.getBigInt(Config.BI_RED_ONE, Config.BI_RED_EC_N)
        )
      );

      this.secrets = Array.from({ length: Config.CARDS_IN_DECK + 1 }).map(() =>
        this.randomizer.getBigInt(Config.BI_RED_ONE, Config.BI_RED_EC_N)
      );
    } else {
      this.points = points;
    }
  }

  shuffleDeck(deck) {
    // Improve the accessibility of secrets later by using the last one now
    const lastSecret = this.secrets[this.secrets.length - 1];

    // Shuffle the deck and then encrypt it to avoid data leaks
    return deck.shuffle(this.randomizer).encryptAll(lastSecret);
  }

  encryptDeck(deck) {
    const lastSecret = this.secrets[this.secrets.length - 1];

    // Remove the shuffle encryption and then encrypt each card one by one
    return deck.decryptAll(lastSecret).encryptAll(this.secrets);
  }
}
