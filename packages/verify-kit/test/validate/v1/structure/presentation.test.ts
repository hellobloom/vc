import {EthUtils, Utils, AtomicVCV1, VPV1} from '@bloomprotocol/attestations-common'
import {buildAtomicVCSubjectV1, buildAtomicVCV1} from '@bloomprotocol/issue-kit'
import {
  RecoverableEcdsaSecp256k1KeyClass2019,
  RecoverableEcdsaSecp256k1Signature2019,
  Purposes,
} from '@bloomprotocol/jsonld-recoverable-es256k'
import EthWallet from 'ethereumjs-wallet'
import {keyUtils} from '@transmute/es256k-jws-ts'

// const keyto = require('@trust/keyto')
const jsigs = require('jsonld-signatures')
const {RecoverableAuthenticationProofPurpose} = Purposes

import * as Validation from '../../../../src/validate/v1/structure'

const issuerWallet = EthWallet.fromPrivateKey(Buffer.from('efca4cdd31923b50f4214af5d2ae10e7ac45a5019e9431cc195482d707485378', 'hex'))
const issuerPrivKey = issuerWallet.getPrivateKey()

console.log({issuerAddress: issuerWallet.getAddressString()})
console.log({issuerPublicKey: issuerWallet.getPublicKeyString()})

const bobWallet = EthWallet.fromPrivateKey(Buffer.from('c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3', 'hex'))

const aliceWallet = EthWallet.fromPrivateKey(Buffer.from('ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f', 'hex'))

const buildVerifiablePresentation = async ({
  wallet,
  atomicCredentials,
  token,
  domain,
}: {
  atomicCredentials: AtomicVCV1[]
  token: string
  domain: string
  wallet: EthWallet
}): Promise<VPV1> => {
  const {didDocument} = await EthUtils.resolveDID(`did:ethr:${wallet.getAddressString()}`)
  const publicKey = didDocument.publicKey[0]

  const unsignedVP: Omit<VPV1<AtomicVCV1>, 'proof'> = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiablePresentation'],
    verifiableCredential: atomicCredentials,
    holder: `did:ethr:${wallet.getAddressString()}`,
  }

  const privateKeyJwk = await keyUtils.privateJWKFromPrivateKeyHex(wallet.getPrivateKeyString().replace('0x', ''))

  const vp: VPV1 = await jsigs.sign(unsignedVP, {
    suite: new RecoverableEcdsaSecp256k1Signature2019({
      key: new RecoverableEcdsaSecp256k1KeyClass2019({
        id: publicKey.id,
        controller: publicKey.controller,
        privateKeyJwk,
      }),
    }),
    documentLoader: EthUtils.documentLoader,
    purpose: new RecoverableAuthenticationProofPurpose({
      challenge: token,
      domain,
    }),
    compactProof: false,
    expansionMap: false, // TODO: remove this
  })

  return vp
}

xtest('Validation.validateCredentialSubject', async () => {
  expect.assertions(1)

  const credentialSubject = await buildAtomicVCSubjectV1({
    subject: `did:ethr:${bobWallet.getAddressString()}`,
    data: {'@type': 'Thing'},
  })

  expect(Utils.isValid(Validation.validateCredentialSubject)(credentialSubject)).toBeTruthy()
})

test('Validation.validateVerifiableCredential', async () => {
  jest.setTimeout(15000)

  expect.assertions(1)

  const credentialSubject = await buildAtomicVCSubjectV1({
    subject: `did:ethr:${bobWallet.getAddressString()}`,
    data: {'@type': 'Thing'},
  })

  const atomicVC = await buildAtomicVCV1({
    credentialSubject,
    type: ['CustomCredential'],
    privateKey: issuerPrivKey,
    issuanceDate: '2016-02-01T00:00:00.000Z',
    expirationDate: '2018-02-01T00:00:00.000Z',
    revocation: {
      '@context': 'https://example.com',
      token: '1234',
    },
  })

  // const atomicVCWOExp = await buildAtomicVCV1({
  //   credentialSubject,
  //   type: ['CustomCredential'],
  //   privateKey: issuerPrivKey,
  //   issuanceDate: '2016-02-01T00:00:00.000Z',
  //   revocation: {
  //     '@context': 'https://example.com',
  //     token: '1234',
  //   },
  // })

  await expect(Utils.isAsyncValid(Validation.validateVerifiableCredential)(atomicVC)).resolves.toBeTruthy()
  // await expect(Utils.isAsyncValid(Validation.validateVerifiableCredential)(atomicVCWOExp)).resolves.toBeTruthy()
})

xtest('Validation.validateVerifiablePresentationV1', async () => {
  expect.assertions(2)

  const credentialSubject = await buildAtomicVCSubjectV1({
    subject: `did:ethr:${bobWallet.getAddressString()}`,
    data: {'@type': 'Thing'},
  })

  const atomicVC = await buildAtomicVCV1({
    credentialSubject,
    type: ['CustomCredential'],
    privateKey: issuerPrivKey,
    issuanceDate: '2016-02-01T00:00:00.000Z',
    expirationDate: '2018-02-01T00:00:00.000Z',
    revocation: {
      '@context': 'https://example.com',
      token: '1234',
    },
  })

  const vp = await buildVerifiablePresentation({
    wallet: bobWallet,
    atomicCredentials: [atomicVC],
    token: EthUtils.generateNonce(),
    domain: 'https://bloom.co/receiveData',
  })

  const invalidVP = await buildVerifiablePresentation({
    wallet: aliceWallet,
    atomicCredentials: [atomicVC],
    token: EthUtils.generateNonce(),
    domain: 'https://bloom.co/receiveData',
  })

  await expect(Utils.isAsyncValid(Validation.validateVerifiablePresentationV1)(vp)).resolves.toBeTruthy()
  await expect(Utils.isAsyncValid(Validation.validateVerifiablePresentationV1)(invalidVP)).resolves.toBeFalsy()
})
