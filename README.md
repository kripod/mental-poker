# mental-poker-js

Mental Poker API implemented in JavaScript, based on the
[thesis of Choongmin Lee](http://www.clee.kr/thesis.pdf).

## Introduction

Mental Poker makes it possible to play a fair game of poker over a physical
distance without the need for a trusted third party, using cryptographic
methods to shuffle and then deal from a deck of cards.

According to the specification of Choongmin Lee, a coalition, even if it is of
the maximum size, cannot gain advantage over honest players except that players
in the coalition can share their own hands.

## Getting started

### Establishing a game

Firstly, every player should generate points of an elliptic curve, serving as a
deck of cards, on the client side. Players must share their generated points
with each other in order to finish setting up a new game.

```js
import { Player } from 'mental-poker-js';

// Points and secrets of a new player get generated automatically
const players = [new Player()];

// Broadcast `player.points` and receive the points of other players
for (const points of pointsOfOpponents) {
  // Secrets of the opponents shall not be known until the end of the game
  players.push(new Player({ points }));
}

// The game can be set up now
const game = new Game(players);
```

### Cascaded shuffling

Each player sequentially shuffles the order of the game's deck points, keeping
the result in secret by encrypting it as a whole using elliptic curve point
multiplication.

```js
// Receive a shuffled deck from an opponent or use the game's original deck if
// the client is the first player to start
let deck = encryptedDeckOfAnOpponent || game.deckOriginal;

// Shuffle the deck by self and then pass it to the next opponent
deck = game.shuffleDeck(deck);
```

### Locking the deck

Each player sequentially locks the game's deck points, keeping the result in
secret by encrypting the points with different keys using elliptic curve point
multiplication.

```js
// Receive a shuffled deck from an opponent
let deck = encryptedDeckOfAnOpponent;

// Decrypt, lock and then pass the deck to the next opponent
deck = game.lockDeck(deck);

// After the deck has been locked by everyone, assign it to the game
game.deckLocked = lockedDeckOfAnOpponent || deck;
```

### Drawing a card

In the previous step, locking was done using a different secret key for each
card. In order to unlock a single card of the deck, every player must provide
the secret corresponding to the locked card at the selected index.

In order to open a card, the secret shall be broadcast to every participant.
Otherwise, each player should only reveal the secret for the person drawing the
card.

```js
// Select a random unowned index of the deck
const cardIndex = game.getRandomUnownedCardIndex();

// Obtain the secret of each opponent at the given card index
const secrets = []; // players[0 .. players.length - 1].secrets[cardIndex]

// Unlock the card using the secrets
const cardId = game.drawCard(cardIndex, secrets);

// Draw a card for self
players[0].cardsInHand.push(cardId);

// Or open it on the table
game.cardsOnTable.push(cardId);
```

## Performance

Execute `npm start` to run a benchmark which measures the performance of each
step mentioned above.
