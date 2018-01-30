import test from 'ava';
import {
  privateKeyModInverse,
  privateKeyVerify,
  publicKeyVerify,
} from 'secp256k1';
import {
  createKeyPair,
  createPublicKey,
  randomPrivateKey,
  verifyKeyPair,
} from './key';

test('randomPrivateKey', (t) => {
  const privateKey = randomPrivateKey();
  t.true(privateKeyVerify(privateKey));
});

test('createPublicKey', (t) => {
  const privateKey1 = randomPrivateKey();
  const publicKey1 = createPublicKey(privateKey1);
  t.true(publicKeyVerify(publicKey1));

  const publicKey2 = createPublicKey();
  t.true(publicKeyVerify(publicKey2));
});

test('createKeyPair', (t) => {
  const privateKey1 = randomPrivateKey();
  const publicKey1 = createPublicKey(privateKey1);
  const keyPair1 = createKeyPair(privateKey1);
  t.deepEqual(keyPair1, {
    publicKey: publicKey1,
    privateKey: privateKey1,
  });

  const keyPair2 = createKeyPair();
  t.true(privateKeyVerify(keyPair2.privateKey));
  t.true(publicKeyVerify(keyPair2.publicKey));
});

test('verifyKeyPair', (t) => {
  const privateKey1 = randomPrivateKey();
  const publicKey1 = createPublicKey(privateKey1);

  const privateKey2 = privateKeyModInverse(privateKey1);
  const publicKey2 = createPublicKey(privateKey2);

  t.true(verifyKeyPair({
    publicKey: publicKey1,
    privateKey: privateKey1,
  }));

  t.true(verifyKeyPair({
    publicKey: publicKey2,
    privateKey: privateKey2,
  }));

  t.false(verifyKeyPair({
    publicKey: publicKey1,
    privateKey: privateKey2,
  }));

  t.false(verifyKeyPair({
    publicKey: publicKey2,
    privateKey: privateKey1,
  }));
});
