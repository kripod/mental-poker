import test from 'ava';
import { createConfig } from './config';

test('createConfig', (t) => {
  const config1 = createConfig(52);
  t.is(config1.cardCount, 52);

  const config2 = createConfig(32);
  t.is(config2.cardCount, 32);
});
