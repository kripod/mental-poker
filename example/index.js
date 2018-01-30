import shuffle from 'lodash.shuffle';
import {
  createConfig,
  createDeck,
  createPlayer,
  decryptCard,
  decryptDeck,
  encryptDeck,
} from '../src';

const PLAYER_COUNT = 4;
const CARD_COUNT = 52;

const config = createConfig(CARD_COUNT);
const players = Array(...Array(PLAYER_COUNT)).map(() => createPlayer(config));

console.log('\n# Card codeword fragments of players\n');
players.forEach(player => console.log(player.cardCodewordFragments));

// Points generation (Thesis, 3.1.1)
const cardCodewords = createDeck(players.map(player => player.cardCodewordFragments));
let deck = cardCodewords;

console.log('\n# Card codewords of the game\n');
console.log(cardCodewords);

// Cascaded shuffling (Thesis, 3.1.2)
console.log('\n# Deck shuffling\n');
players.forEach((player) => {
  deck = encryptDeck(shuffle(deck), player.keyPairs[CARD_COUNT].privateKey);
  console.log(deck);
});

// Locking (Thesis, 3.1.3)
console.log('\n# Deck locking\n');
players.forEach((player) => {
  deck = encryptDeck(
    decryptDeck(deck, player.keyPairs[CARD_COUNT].privateKey),
    player.keyPairs.map(keyPair => keyPair.privateKey),
  );
  console.log(deck);
});

// Drawing/opening (Thesis, 3.2-3.3)
console.log('\n# Drawing/opening cards\n');
deck.forEach((cardEncrypted, i) => {
  const cardDecrypted = decryptCard(
    cardEncrypted,
    players.map(player => player.keyPairs[i].privateKey),
  );
  const codewordIndex = cardCodewords.findIndex(cardCodeword =>
    cardCodeword.equals(cardDecrypted));

  console.log('Picked index:', i);
  console.log('Card (encrypted):', cardEncrypted);
  console.log('Card (decrypted):', cardDecrypted);
  console.log('Codeword index:', codewordIndex, '\n');
});
