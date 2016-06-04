import test from 'ava';
import * as Config from './../src/config';
import { Game, Player } from './../src';

const PLAYER_COUNT = 4;

const players = Array.from(new Array(PLAYER_COUNT), () => new Player());
const game = new Game(players);
let deck = game.deckOriginal;

test.serial('cascaded shuffling', (t) => {
  for (const player of players) {
    deck = player.shuffleDeck(deck);
  }

  t.pass();
});

test.serial('locking', (t) => {
  for (const player of players) {
    deck = player.lockDeck(deck);
  }

  game.deckLocked = deck;
  t.pass();
});

test.serial('drawing/opening', (t) => {
  // Draw every card
  const cardIds = new Array(Config.CARDS_IN_DECK);
  for (let i = Config.CARDS_IN_DECK - 1; i >= 0; --i) {
    // Get the secret of every player which corresponds to the given card index
    const secrets = players.map((player) => player.secrets[i]);
    cardIds[i] = game.drawCard(i, secrets);

    // Cards shall not be allowed to be dealt more than once
    t.is(game.drawCard(i, secrets), -1);
  }

  // Check whether every card has been drawn exactly once
  t.deepEqual(
    cardIds.sort((a, b) => a - b),
    Array.from(new Array(Config.CARDS_IN_DECK), (v, i) => i)
  );
});
