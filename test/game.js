import test from 'ava';
import { Config, Game, Player } from './../src';

const PLAYER_COUNT = 4;

const players = Array.from(new Array(PLAYER_COUNT), () =>
  (new Player()).generatePoints().generateSecrets()
);
const game = new Game(players).generateInitialDeck();

test.serial('cascaded shuffling', (t) => {
  for (const player of players) {
    game.shuffleDeck(player);
  }

  t.pass();
});

test.serial('locking', (t) => {
  for (const player of players) {
    game.lockDeck(player);
  }

  t.pass();
});

test.serial('drawing/opening', (t) => {
  // Draw every card
  const cardIds = new Array(Config.cardsInDeck);
  for (let i = Config.cardsInDeck - 1; i >= 0; --i) {
    const cardIndex = game.getRandomPickableCardIndex();

    // Get the secret of every player which corresponds to the given card index
    const secrets = players.map((player) => player.secrets[cardIndex]);
    cardIds[i] = game.pickCard(cardIndex, secrets);

    // Cards shall not be allowed to be dealt more than once
    t.is(game.pickCard(cardIndex, secrets), -1);
  }

  // Check whether every card has been drawn exactly once
  t.deepEqual(
    cardIds.sort((a, b) => a - b),
    Array.from(new Array(Config.cardsInDeck), (v, i) => i)
  );
});
