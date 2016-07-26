import test from 'ava';
import { Bet, BetType, Config, Game, GameState, Player } from './../src';

const PLAYER_COUNT = 4;

const sharedPlayers = Array.from(new Array(PLAYER_COUNT), () =>
  new Player().generatePoints().generateSecrets()
);
const sharedGame = new Game({ players: sharedPlayers });

test.serial('distributed points generation', (t) => {
  sharedGame.generateInitialDeck();

  t.is(sharedGame.deckSequence[0].points.length, Config.cardsInDeck);
});

test.serial('cascaded shuffling', (t) => {
  for (const player of sharedPlayers) {
    const deck = sharedGame.shuffleDeck(player);

    t.is(deck.points.length, Config.cardsInDeck);
    t.is(deck, sharedGame.deckSequence[sharedGame.deckSequence.length - 1]);
  }
});

test.serial('locking', (t) => {
  for (const player of sharedPlayers) {
    const deck = sharedGame.lockDeck(player);

    t.is(deck.points.length, Config.cardsInDeck);
    t.is(deck, sharedGame.deckSequence[sharedGame.deckSequence.length - 1]);
  }
});

test.serial('card picking/drawing/opening', (t) => {
  // Draw every card
  const cardIds = new Array(Config.cardsInDeck);
  for (let i = Config.cardsInDeck - 1; i >= 0; --i) {
    const cardIndex = sharedGame.getRandomPickableCardIndex();
    let cardId;

    let shouldCardBeInHandOfSelf = false;
    let shouldCardBeOnTable = false;

    if (i < 7) {
      if (i < 2) {
        // Draw 2 cards for self
        cardId = sharedGame.drawCard(cardIndex).id;
        shouldCardBeInHandOfSelf = true;
      } else {
        // Open 5 cards
        cardId = sharedGame.openCard(cardIndex).id;
        shouldCardBeOnTable = true;
      }
    } else {
      // Only pick the remaining cards, but don't assign them anywhere
      cardId = sharedGame.pickCard(cardIndex).id;
    }

    cardIds[i] = cardId;

    // Check the assignment of cards
    t.false(
      shouldCardBeInHandOfSelf &&
      !sharedGame.playerSelf.cardsInHand.find((card) => card.id === cardId)
    );
    t.false(
      shouldCardBeOnTable &&
      !sharedGame.cardsOnTable.find((card) => card.id === cardId)
    );

    // Cards shall not be allowed to be dealt more than once
    t.is(sharedGame.pickCard(cardIndex), null);
  }

  // Check whether every card has been drawn exactly once
  t.deepEqual(
    cardIds.sort((a, b) => a - b),
    Array.from(new Array(Config.cardsInDeck), (v, i) => i)
  );
});

test.serial('disqualify unfair players', (t) => {
  const unfairPlayerIndex = PLAYER_COUNT >> 1;
  const fairPlayer = sharedPlayers[unfairPlayerIndex];
  let unfairPlayer;

  // Simulate messing up deck shuffling
  unfairPlayer = new Player(fairPlayer).generateSecrets();
  sharedGame.players[unfairPlayerIndex] = unfairPlayer;
  t.deepEqual(sharedGame.verify(), [unfairPlayer]);

  // Simulate messing up deck locking
  unfairPlayer = new Player(fairPlayer).generateSecrets();
  unfairPlayer.secrets[fairPlayer.secrets.length - 1] =
    fairPlayer.secrets[fairPlayer.secrets.length - 1];
  unfairPlayer.secretHashes[fairPlayer.secrets.length - 1] =
    fairPlayer.secretHashes[fairPlayer.secrets.length - 1];
  sharedGame.players[unfairPlayerIndex] = unfairPlayer;
  t.deepEqual(sharedGame.verify(), [unfairPlayer]);
});

test('random gameplay', (t) => {
  const HAND_CARD_COUNT = 2;
  const TABLE_CARDS_DEALT_BY_ROUND = [0, 3, 1, 1];

  const players = Array.from(
    new Array(PLAYER_COUNT),
    () => new Player().generateSecrets()
  );
  const game = new Game({ players }).generateInitialDeck();

  t.is(game.state, GameState.SHUFFLING_DECK);
  for (const player of players) {
    game.shuffleDeck(player);
  }

  t.is(game.state, GameState.LOCKING_DECK);
  for (const player of players) {
    game.lockDeck(player);
  }

  // Draw cards for each player
  t.is(game.state, GameState.PLAYING);
  for (const player of players) {
    for (let i = HAND_CARD_COUNT; i > 0; --i) {
      const cardIndex = game.getRandomPickableCardIndex();
      player.cardsInHand.push(game.pickCard(cardIndex));
    }

    t.is(player.cardsInHand.length, HAND_CARD_COUNT);
    game.takeTurn();
  }

  let turnCount = 0;
  for (const tableCardsDealt of TABLE_CARDS_DEALT_BY_ROUND) {
    turnCount += 1;

    // Deal a given amount of cards on the table
    for (let i = tableCardsDealt; i > 0; --i) {
      const cardIndex = game.getRandomPickableCardIndex();
      game.openCard(cardIndex);
    }

    // Let each player bet in the turn
    for (const player of players) {
      game.takeTurn(new Bet({ type: BetType.CHECK }));
      t.is(player.bets.length, turnCount);
    }
  }

  game.end();
  t.is(game.state, GameState.ENDED);
  t.is(game.verify().length, 0);
  t.true(game.evaluateHands().length > 0);
});

test('serialization', (t) => {
  const game = new Game({ players: [new Player()] });
  t.deepEqual(
    Object.keys(game.toJSON()),
    ['state', 'players', 'actingPlayerIndex']
  );

  game.generateInitialDeck();
  t.deepEqual(
    Object.keys(game.toJSON()),
    ['state', 'players', 'actingPlayerIndex', 'points']
  );
});
