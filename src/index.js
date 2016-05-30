import Deck from './deck';
import Game from './game';
import Player from './player';

export {
  Player,
};

export default async function () {
  const PLAYER_COUNT = 4;

  const players = Array.from({ length: PLAYER_COUNT }).map(() => new Player());
  const game = new Game(players);

  console.log('3.1.1 done');

  // 3.1.2 - Cascaded shuffling
  let deck = game.deckOriginal;
  for (const player of players) {
    deck = player.shuffleDeck(deck);
  }

  console.log('3.1.2 done');

  // 3.1.3 - Locking
  for (const player of players) {
    deck = player.encryptDeck(deck);
  }

  game.deckEncrypted = deck;
  console.log('3.1.3 done');

  // 3.2 - Drawing
  const index = 42;
  const secrets = [];
  for (const player of players) {
    secrets.push(player.secrets[index]);
  }

  console.log(deck.decryptSingle(index, secrets));
  console.log(game.drawCard(index, secrets));
  console.log('3.2 done');
}
