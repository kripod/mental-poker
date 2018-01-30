# mental-poker

[![Version (npm)](https://img.shields.io/npm/v/mental-poker.svg)](https://npmjs.com/package/mental-poker)
[![Build status](https://img.shields.io/travis/kripod/mental-poker/master.svg)](https://travis-ci.org/kripod/mental-poker)
[![Dependencies](https://img.shields.io/david/kripod/mental-poker.svg)](https://david-dm.org/kripod/mental-poker)
[![Code style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

A purely functional mental poker library, based on the [thesis of Choongmin Lee][].

[thesis of choongmin lee]: http://www.clee.kr/thesis.pdf

## Introduction

Mental poker makes it possible to play a fair game of poker over a physical distance without the need for a trusted third party, using cryptographic methods to shuffle and then deal from a deck of cards.

A coalition, even if it is of the maximum size, shall not gain advantage over honest players, except that players in a coalition may know the hands of each other.

## Getting started

_It is strongly recommended to [read the specification][] before exploring the interface of the implementation._

An example of using the API can be found [here](example).

[read the specification]: specs

### Establishing a game

#### Configuration

Firstly, a configuration object has to be created and agreed upon by players.

```js
import { createConfig } from 'mental-poker';

// Set up a game with a standard 52-card deck
const config = createConfig(52);
```

#### Initial deck setup

Each player shall generate a codeword fragment for each card of the configured deck type. Fragments which correspond to the same card will be combined to produce a deck of cards, represented as an array of codewords.

Players should share codeword fragments with each other through a commitment scheme, to prevent malicious entities from manipulating the generated codewords in their own favor.

```js
import { createPlayer, createDeck } from 'mental-poker';

const self = createPlayer(config);

// Players should share their public data with each other
// Sensitive information (e.g. private keys) shall be kept in secret
const opponents = [
  /* Received from others */
];

// Points generation (Thesis, 3.1.1)
const cardCodewords = createDeck(
  [self, ...opponents].map(player => player.cardCodewordFragments),
);
```

After that, the deck shall be shuffled and each of its cards must be encrypted one by one.

```js
import { encryptDeck, decryptDeck } from 'mental-poker';

// Any kind of array shuffling algorithm may be used
import shuffle from 'lodash.shuffle';

// The deck may also be received from the previous player in turn
let deck = cardCodewords;

// Cascaded shuffling (Thesis, 3.1.2)
// Each player shall shuffle the deck and encrypt it as a whole
deck = encryptDeck(shuffle(deck), self.keyPairs[config.cardCount].privateKey);

// The deck shall be passed on to the next player
deck = [
  /* And then received from someone else */
];

// Locking (Thesis, 3.1.3)
// Each player shall decrypt the deck as a whole and encrypt its cards one by one
deck = encryptDeck(
  decryptDeck(deck, self.keyPairs[config.cardCount].privateKey),
  self.keyPairs.map(keyPair => keyPair.privateKey),
);
```

### Drawing cards

The value of a card may be known by anyone in possession of its corresponding private keys it has been encrypted with.

```js
import { decryptCard } from 'mental-poker';

// Drawing/opening (Thesis, 3.2-3.3)
// Choose an encrypted card at random
const cardEncrypted = deck[i];

// Find out the codeword of the card after all the required keys are available
const cardDecrypted = decryptCard(
  cardEncrypted,
  [self, ...opponents].map(player => player.keyPairs[i].privateKey),
);

// The resulting codeword index below represents a card ID
// If its value is -1, then someone has violated the protocol
const codewordIndex = cardCodewords.findIndex(cardCodeword =>
  cardCodeword.equals(cardDecrypted),
);
```

## API

Please see the [API reference][] for further information.

[api reference]: docs/API.md
