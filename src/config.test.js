import test from 'ava';
import Config from './config';

test('ecAlgorithm accessibility', (t) => {
  t.is(typeof Config.ecAlgorithm, 'string');
});
