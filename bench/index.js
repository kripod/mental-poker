import Benchmark from 'benchmark';
import { Config, Game, Player } from './../lib';

const PLAYER_COUNT = 4;

let players;
let game;
let deck;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const suite = new Benchmark.Suite();

// Output results to the console
suite.on('cycle', (event) => {
  console.log(event.target.toString()); // eslint-disable-line no-console
});

suite.add('points generation', () => {
  players = Array.from(new Array(PLAYER_COUNT), () => new Player());
  game = new Game(players);
  deck = game.deckOriginal;
});

suite.add('cascaded shuffling', () => {
  for (const player of players) {
    deck = player.shuffleDeck(deck);
  }
});

suite.add('locking', () => {
  for (const player of players) {
    deck = player.lockDeck(deck);
  }

  game.deckLocked = deck;
});

suite.add('drawing/opening', () => {
  const cardIndex = getRandomInt(0, Config.CARDS_IN_DECK);

  // Get the secret of every player which corresponds to the given card index
  const secrets = players.map((player) => player.secrets[cardIndex]);

  // This should always measure the worst case scenario where no card can be
  // returned, because the deck was shuffled and locked multiple times
  game.drawCard(cardIndex, secrets);
});

suite.run();
