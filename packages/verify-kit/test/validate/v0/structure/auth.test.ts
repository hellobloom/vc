import {EthUtils, Utils} from '@bloomprotocol/vc-common'
import * as EthU from 'ethereumjs-util'
import EthWallet from 'ethereumjs-wallet'

import * as Validation from '../../../../src/validate/v0/structure'
import {buildVerifiableAuth, buildAuthProof} from '../../../../src/build'

const aliceWallet = EthWallet.fromPrivateKey(new Buffer('c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3', 'hex'))
const alicePrivkey = aliceWallet.getPrivateKey()

const bobWallet = EthWallet.fromPrivateKey(new Buffer('ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f', 'hex'))
const bobPrivkey = bobWallet.getPrivateKey()
const bobAddress = bobWallet.getAddressString()

const authToken = EthUtils.generateNonce()
const authDomain = 'https://bloom.co/receiveData'
const authProof = buildAuthProof(bobAddress, authToken, authDomain)
const authSig = EthUtils.signHash(EthU.toBuffer(EthUtils.hashMessage(Utils.orderedStringify(authProof))), bobPrivkey)
const auth = buildVerifiableAuth(authProof, authSig)

test('Validation.validateAuthProof', () => {
  expect(Validation.validateAuthProof(auth.proof)).toBeTruthy()
  expect(Validation.validateAuthProof({}).kind === 'invalid_param').toBeTruthy()
  expect(Validation.validateAuthProof(auth).kind === 'invalid_param').toBeTruthy()
})

test('Validation.validateAuthSignature', () => {
  expect(Validation.validateAuthSignature(authSig, auth)).toBeTruthy()
  expect(
    Validation.validateAuthSignature(
      EthUtils.signHash(alicePrivkey, EthU.toBuffer(EthUtils.hashMessage(Utils.orderedStringify(authProof)))),
      auth,
    ),
  ).toBeFalsy()
})

test('Validation.validateVerifiableAuth', () => {
  expect(Validation.validateVerifiableAuth(auth)).toBeTruthy()
  expect(Validation.validateVerifiableAuth(auth.proof)).toBeTruthy()
  expect(Validation.validateVerifiableAuth({}).kind === 'invalid_param').toBeTruthy()
})
