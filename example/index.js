const { Game, Player } = require('./../lib');

const PLAYER_COUNT = 4;

console.time('Total');
console.time('3.1.1');
const players = Array.from(new Array(PLAYER_COUNT), () => new Player());
const game = new Game(players);

console.timeEnd('3.1.1');

// 3.1.2 - Cascaded shuffling
console.time('3.1.2');
let deck = game.deckOriginal;
for (const player of players) {
  deck = player.shuffleDeck(deck);
}

console.timeEnd('3.1.2');

// 3.1.3 - Locking
console.time('3.1.3');
for (const player of players) {
  deck = player.lockDeck(deck);
}

game.deckEncrypted = deck;
console.timeEnd('3.1.3');

// 3.2 - Drawing
console.time('3.2');
const index = 42;
const secrets = [];
for (const player of players) {
  secrets.push(player.secrets[index]);
}

// console.log(game.deckOriginal.points);
// console.log(deck.unlockSingle(index, secrets));
console.log(`Card ID: ${game.drawCard(index, secrets)}`);
console.timeEnd('3.2');
console.timeEnd('Total');
