import Benchmark from 'benchmark';
import { Game, Player } from './../lib';

/* eslint-disable no-console */

const PLAYER_COUNT = 4;

let players;
let game;
let deck;

const suite = new Benchmark.Suite();

// Output results to the console
suite.on('cycle', (event) => {
  console.log(event.target.toString());
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

suite.add('locking the deck', () => {
  for (const player of players) {
    deck = player.lockDeck(deck);
  }

  game.deckLocked = deck;
});

suite.add('drawing a card', () => {
  const cardIndex = players[0].getRandomCardIndex();

  // Get the secret of every player which corresponds to the given card index
  const secrets = players.map((player) => player.secrets[cardIndex]);

  // This should always measure the worst case scenario where no card can be
  // returned, because the deck was shuffled and locked multiple times
  game.drawCard(cardIndex, secrets);
});

console.log(`Started a benchmark simulating a game of ${PLAYER_COUNT} players`);
suite.run();
