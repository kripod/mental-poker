import test from 'ava';
import { createConfig } from './config';
import { createPlayer } from './player';

test('createPlayer', (t) => {
  const config = createConfig();
  const player = createPlayer(config);

  t.is(player.cardCodewordFragments.length, config.cardCount);
  t.is(player.keyPairs.length, config.cardCount + 1);
});
