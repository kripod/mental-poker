import Benchmark from 'benchmark';
import { Game, Player } from './..';

/* eslint-disable no-console */

const PLAYER_COUNT = 4;

let players;
let game;

const suite = new Benchmark.Suite();

// Output results to the console
suite.on('cycle', (event) => {
  console.log(event.target.toString());
});

suite.add('points generation', () => {
  players = Array.from(new Array(PLAYER_COUNT), () => new Player());
  game = new Game(players);
  game.generateInitialDeck();
});

suite.add('cascaded shuffling', () => {
  for (const player of players) {
    game.shuffleDeck(player);
  }
});

suite.add('locking the deck', () => {
  for (const player of players) {
    game.lockDeck(player);
  }
});

suite.add('picking a card', () => {
  const cardIndex = game.getRandomPickableCardIndex();

  // This should always measure the worst case scenario where no card can be
  // returned, because the deck was shuffled and locked multiple times
  game.pickCard(cardIndex);
});

console.log(`Started a benchmark simulating a game of ${PLAYER_COUNT} players`);
suite.run();
