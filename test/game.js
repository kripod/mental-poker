import test from 'ava';
import { Config, Game, Player } from './../src';

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
  const cardIds = new Array(Config.cardsInDeck);
  for (let i = Config.cardsInDeck - 1; i >= 0; --i) {
    const cardIndex = game.getRandomUnownedCardIndex();

    // Get the secret of every player which corresponds to the given card index
    const secrets = players.map((player) => player.secrets[cardIndex]);
    cardIds[i] = game.drawCard(cardIndex, secrets);

    // Cards shall not be allowed to be dealt more than once
    t.is(game.drawCard(cardIndex, secrets), -1);
  }

  // Check whether every card has been drawn exactly once
  t.deepEqual(
    cardIds.sort((a, b) => a - b),
    Array.from(new Array(Config.cardsInDeck), (v, i) => i)
  );
});
