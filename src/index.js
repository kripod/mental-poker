import Game from './game';
import Player from './player';

export {
  Player,
};

export default async function () {
  const PLAYER_COUNT = 4;

  console.time('3.1.1');
  const players = Array.from({ length: PLAYER_COUNT }).map(() => new Player());
  const game = new Game(players);

  console.timeEnd('3.1.1');
  console.log('3.1.1 done');

  // 3.1.2 - Cascaded shuffling
  console.time('3.1.2');
  let deck = game.deckOriginal;
  for (const player of players) {
    deck = player.shuffleDeck(deck);
  }

  console.timeEnd('3.1.2');
  console.log('3.1.2 done');

  // 3.1.3 - Locking
  console.time('3.1.3');
  for (const player of players) {
    deck = player.encryptDeck(deck);
  }

  game.deckEncrypted = deck;
  console.timeEnd('3.1.3');
  console.log('3.1.3 done');

  // 3.2 - Drawing
  console.time('3.2');
  const index = 42;
  const secrets = [];
  for (const player of players) {
    secrets.push(player.secrets[index]);
  }

  console.log(game.deckOriginal.points);
  console.log(deck.decryptSingle(index, secrets));
  console.log(game.drawCard(index, secrets));
  console.timeEnd('3.2');
  console.log('3.2 done');
}
