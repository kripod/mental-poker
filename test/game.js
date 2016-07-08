import test from 'ava';
import { Config, Game, Player } from './../src';

const PLAYER_COUNT = 4;

const players = Array.from(new Array(PLAYER_COUNT), () =>
  (new Player()).generatePoints().generateSecrets()
);
const game = new Game(players);

test.serial('distributed points generation', (t) => {
  game.generateInitialDeck();

  t.is(game.deckSequence[0].points.length, Config.cardsInDeck);
});

test.serial('cascaded shuffling', (t) => {
  for (const player of players) {
    const deck = game.shuffleDeck(player);

    t.is(deck.points.length, Config.cardsInDeck);
    t.is(deck, game.deckSequence[game.deckSequence.length - 1]);
  }

  t.pass();
});

test.serial('locking', (t) => {
  for (const player of players) {
    const deck = game.lockDeck(player);

    t.is(deck.points.length, Config.cardsInDeck);
    t.is(deck, game.deckSequence[game.deckSequence.length - 1]);
  }

  t.pass();
});

test.serial('card picking/drawing/opening', (t) => {
  // Draw every card
  const cardIds = new Array(Config.cardsInDeck);
  for (let i = Config.cardsInDeck - 1; i >= 0; --i) {
    const cardIndex = game.getRandomPickableCardIndex();
    let cardId;

    let shouldCardBeInHandOfSelf = false;
    let shouldCardBeOnTable = false;

    if (i < 7) {
      if (i < 2) {
        // Draw 2 cards for self
        cardId = game.drawCard(cardIndex);
        shouldCardBeInHandOfSelf = true;
      } else {
        // Open 5 cards
        cardId = game.openCard(cardIndex);
        shouldCardBeOnTable = true;
      }
    } else {
      // Only pick the remaining cards, but don't assign them anywhere
      cardId = game.pickCard(cardIndex);
    }

    cardIds[i] = cardId;

    // Check the assignment of cards
    t.false(
      shouldCardBeInHandOfSelf &&
      game.playerSelf.cardsInHand.indexOf(cardId) < 0
    );
    t.false(
      shouldCardBeOnTable &&
      game.cardsOnTable.indexOf(cardId) < 0
    );

    // Cards shall not be allowed to be dealt more than once
    t.is(game.pickCard(cardIndex), -1);
  }

  // Check whether every card has been drawn exactly once
  t.deepEqual(
    cardIds.sort((a, b) => a - b),
    Array.from(new Array(Config.cardsInDeck), (v, i) => i)
  );
});
