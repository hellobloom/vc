import {EthUtils, Utils, AtomicVCV1} from '@bloomprotocol/attestations-common'
import {buildClaimNodeV1, buildSDLegacyVCV1, buildSDVCV1, buildSDBatchVCV1} from '@bloomprotocol/issue-kit'
import EthWallet from 'ethereumjs-wallet'
import * as ethSigUtil from 'eth-sig-util'

import * as Validation from '../../../../src/validate/v1/structure'

import {Holder, getHolder, buildBatchAtomicVCV1, buildOnChainAtomicVCV1, buildVerifiablePresentation, buildLegacyAtomicVCV1} from './utils'

const issuerWallet = EthWallet.fromPrivateKey(Buffer.from('efca4cdd31923b50f4214af5d2ae10e7ac45a5019e9431cc195482d707485378', 'hex'))
const issuerPrivKey = issuerWallet.getPrivateKey()

const bobWallet = EthWallet.fromPrivateKey(Buffer.from('c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3', 'hex'))

const aliceWallet = EthWallet.fromPrivateKey(Buffer.from('ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f', 'hex'))

const buildEmailClaimNode = () => {
  return buildClaimNodeV1({
    dataStr: 'test@bloom.co',
    type: 'email',
    provider: 'Me',
    version: '1.0.0',
  })
}

const buildPhoneClaimNode = () => {
  return buildClaimNodeV1({
    dataStr: '+17203600587',
    type: 'phone',
    provider: 'Me',
    version: '1.0.0',
  })
}

const createSDLegacyVCV1 = async ({issuer, holder}: {issuer: Buffer; holder: Holder}) => {
  return await buildSDLegacyVCV1({
    dataNodes: [buildPhoneClaimNode(), buildEmailClaimNode()],
    subjectDID: `did:ethr:${holder.publicStringHex}`,
    issuanceDate: '2016-02-01T00:00:00.000Z',
    expirationDate: '2018-02-01T00:00:00.000Z',
    privateKey: issuer,
  })
}

const createLegacyAtomicVCV1 = async ({issuer, holder}: {issuer: Buffer; holder: Holder}) => {
  const sdvc = await createSDLegacyVCV1({
    issuer,
    holder,
  })

  const atomicVc = buildLegacyAtomicVCV1({
    subject: `did:ethr:${holder.publicStringHex}`,
    tx: '0xf1d6b6b64e63737a4ef023fadc57e16793cfae5d931a3c301d14e375e54fabf6',
    stage: 'mainnet',
    target: sdvc.credentialSubject.dataNodes[0],
    sdvc,
    authorization: [],
    holder,
  })

  return atomicVc
}

const createSDVCV1 = async ({issuer, holder}: {issuer: Buffer; holder: Holder}) => {
  return await buildSDVCV1({
    claimNodes: [buildPhoneClaimNode(), buildEmailClaimNode()],
    subjectDID: `did:ethr:${holder.publicStringHex}`,
    issuanceDate: '2016-02-01T00:00:00.000Z',
    expirationDate: '2018-02-01T00:00:00.000Z',
    privateKey: issuer,
  })
}

const createAtomicVCV1 = async ({issuer, holder}: {issuer: Buffer; holder: Holder}) => {
  const sdvc = await createSDVCV1({issuer, holder})

  const atomicVc = await buildOnChainAtomicVCV1({
    subject: `did:ethr:${holder.publicStringHex}`,
    tx: '0xf1d6b6b64e63737a4ef023fadc57e16793cfae5d931a3c301d14e375e54fabf6',
    stage: 'mainnet',
    target: sdvc.credentialSubject.claimNodes[0],
    sdvc,
    authorization: [],
    holder,
  })

  return atomicVc
}

const createBatchAtomicVCV1 = async ({issuer, holder}: {issuer: Buffer; holder: Holder}) => {
  const sdvc = await createSDVCV1({issuer, holder})

  const contractAddress = '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
  const requestNonce = EthUtils.generateNonce()

  const subjectSignature = ethSigUtil.signTypedData(holder.private, {
    data: EthUtils.getAttestationAgreement(contractAddress, 1, sdvc.proof.layer2Hash, requestNonce),
  })

  const batchVC = await buildSDBatchVCV1({
    credential: sdvc,
    privateKey: issuer,
    contractAddress,
    subjectSignature,
    requestNonce,
  })

  const batchAtomicVC = buildBatchAtomicVCV1({
    subject: `did:ethr:${holder.publicStringHex}`,
    stage: 'mainnet',
    target: batchVC.credentialSubject.claimNodes[0],
    sdvc: batchVC,
    authorization: [],
    holder,
  })

  return batchAtomicVC
}

const createVerifiablePresentationV1 = ({atomicVcs, holder}: {atomicVcs: AtomicVCV1[]; holder: Holder}) => {
  return buildVerifiablePresentation({
    atomicCredentials: atomicVcs,
    token: EthUtils.generateNonce(),
    domain: 'https://bloom.co/receiveData',
    holder,
  })
}

test('Validation.validateCredentialSubject', async () => {
  expect.assertions(2)

  const atomicVc = await createAtomicVCV1({
    issuer: issuerPrivKey,
    holder: getHolder(bobWallet),
  })

  const batchAtomicVC = await createBatchAtomicVCV1({
    issuer: issuerPrivKey,
    holder: getHolder(bobWallet),
  })

  expect(Utils.isValid(Validation.validateCredentialSubject)(atomicVc.credentialSubject)).toBeTruthy()
  expect(Utils.isValid(Validation.validateCredentialSubject)(batchAtomicVC.credentialSubject)).toBeTruthy()
})

test('Validation.validateVerifiableCredential', async () => {
  expect.assertions(2)

  const atomicVc = await createAtomicVCV1({
    issuer: issuerPrivKey,
    holder: getHolder(bobWallet),
  })

  const batchAtomicVC = await createBatchAtomicVCV1({
    issuer: issuerPrivKey,
    holder: getHolder(bobWallet),
  })

  await expect(Utils.isAsyncValid(Validation.validateVerifiableCredential)(atomicVc)).resolves.toBeTruthy()
  await expect(Utils.isAsyncValid(Validation.validateVerifiableCredential)(batchAtomicVC)).resolves.toBeTruthy()
})

test('Validation.validateVerifiablePresentationV1', async () => {
  expect.assertions(5)

  const legacyAtomicVC = await createLegacyAtomicVCV1({
    issuer: issuerPrivKey,
    holder: getHolder(bobWallet),
  })

  const atomicVc = await createAtomicVCV1({
    issuer: issuerPrivKey,
    holder: getHolder(bobWallet),
  })

  const batchAtomicVC = await createBatchAtomicVCV1({
    issuer: issuerPrivKey,
    holder: getHolder(bobWallet),
  })

  const alicesAtomicVC = await createAtomicVCV1({
    issuer: issuerPrivKey,
    holder: getHolder(aliceWallet),
  })

  const legacyVerifiablePresentation = await createVerifiablePresentationV1({
    atomicVcs: [legacyAtomicVC],
    holder: getHolder(bobWallet),
  })

  const verifiablePresentation = await createVerifiablePresentationV1({
    atomicVcs: [atomicVc],
    holder: getHolder(bobWallet),
  })

  const batchVerifiablePresentation = await createVerifiablePresentationV1({
    atomicVcs: [batchAtomicVC],
    holder: getHolder(bobWallet),
  })

  const mixedVerifiablePresentation = await createVerifiablePresentationV1({
    atomicVcs: [legacyAtomicVC, atomicVc, batchAtomicVC],
    holder: getHolder(bobWallet),
  })

  const invalidVerifiablePresentation = await createVerifiablePresentationV1({
    atomicVcs: [atomicVc, alicesAtomicVC],
    holder: getHolder(bobWallet),
  })

  await expect(await Validation.validateVerifiablePresentationV1(legacyVerifiablePresentation)).resolves.toBeTruthy()
  await expect(await Validation.validateVerifiablePresentationV1(verifiablePresentation)).resolves.toBeTruthy()
  await expect(await Validation.validateVerifiablePresentationV1(batchVerifiablePresentation)).resolves.toBeTruthy()
  await expect(await Validation.validateVerifiablePresentationV1(mixedVerifiablePresentation)).resolves.toBeTruthy()
  await expect(await Validation.validateVerifiablePresentationV1(invalidVerifiablePresentation)).resolves.toBeFalsy()
})
