import test from 'ava';
import { Config } from './../src';

test('ecAlgorithm accessibility', (t) => {
  t.is(typeof Config.ecAlgorithm, 'string');
});
