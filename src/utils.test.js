import test from 'ava';
import BigInt from 'bn.js';
import { Config, Utils } from '../src';

test('isArrayEqualWith', (t) => {
  t.true(Utils.isArrayEqualWith([], []));
  t.true(Utils.isArrayEqualWith([1], [1]));
  t.true(Utils.isArrayEqualWith(['a', 'b', 'c'], ['a', 'b', 'c']));
  t.true(Utils.isArrayEqualWith(
    ['a', 'b', 'c'],
    ['A', 'B', 'C'],
    (a, b) => a.toLowerCase() === b.toLowerCase(),
  ));

  t.false(Utils.isArrayEqualWith([], [2]));
  t.false(Utils.isArrayEqualWith([1], [2]));
  t.false(Utils.isArrayEqualWith(['a', 'b', 'c'], ['x', 'y', 'z']));
  t.false(Utils.isArrayEqualWith(['a', 'b', 'c'], ['A', 'B', 'C']));
});

test('getRandomInt', (t) => {
  t.is(Utils.getRandomInt(0x7fffffff, 0x80000000), 0x7fffffff);
  t.is(Utils.getRandomInt(0xffffffff, 0x100000000), 0xffffffff);

  let result;
  for (let i = 100; i > 0; i -= 1) {
    result = Utils.getRandomInt(0, 2);
    t.true(result >= 0 && result < 2);

    result = Utils.getRandomInt(10, 12);
    t.true(result >= 10 && result < 12);

    result = Utils.getRandomInt(250, 260);
    t.true(result >= 250 && result < 260);
  }
});

test('getRandomBigInt', (t) => {
  t.true(Utils.getRandomBigInt(Config.ec.curve.zero, Config.ec.curve.one).isZero());
  t.true(Utils.getRandomBigInt(Config.ec.curve.one, Config.ec.curve.two).eqn(1));

  let result;
  for (let i = 100; i > 0; i -= 1) {
    result = Utils.getRandomBigInt(
      Config.ec.curve.zero,
      Config.ec.curve.two,
    );
    t.true(result.gten(0) && result.ltn(2));

    result = Utils.getRandomBigInt(
      new BigInt(10).toRed(Config.ec.curve.red),
      new BigInt(12).toRed(Config.ec.curve.red),
    );
    t.true(result.gten(10) && result.ltn(12));

    result = Utils.getRandomBigInt(
      new BigInt(250).toRed(Config.ec.curve.red),
      new BigInt(260).toRed(Config.ec.curve.red),
    );
    t.true(result.gten(250) && result.ltn(260));
  }
});

test('shuffleArray', (t) => {
  const original = [1, 2, 3, 4, 5, 6];
  const shuffled = Utils.shuffleArray(original);

  // Check immutability
  t.not(shuffled, original);

  // Check whether the result's length is correct
  t.is(shuffled.length, original.length);
});
