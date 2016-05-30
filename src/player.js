import BN from 'bn.js';
import random from 'random-js';
import * as Config from './config';
import Randomizer from './randomizer';

export default class Player {
  keyPair = Randomizer.getEciesKeyPair();

  randomizer = new Randomizer(
    random.engines.mt19937().seedWithArray(
      new Uint32Array(this.keyPair.privateKey.buffer)
    )
  );

  points = Array.from({ length: Config.CARDS_IN_DECK }).map(() =>
    Config.EC.g.mul(
      this.randomizer.getBigInt(new BN(0), Config.EC.n)
    )
  );

  secrets = Array.from({ length: Config.CARDS_IN_DECK + 1 }).map(() =>
    this.randomizer.getBigInt(new BN(0), Config.EC.n)
  );
}
