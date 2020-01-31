import {EthUtils, Utils, IProof, FullVC} from '@bloomprotocol/attestations-common'
import {
  buildClaimNodeV1,
  buildSelectivelyDisclosableLegacyVCV1,
  buildSelectivelyDisclosableVCV1,
  buildSelectivelyDisclosableBatchVCV1,
} from '@bloomprotocol/issue-kit'
import * as EthU from 'ethereumjs-util'
import EthWallet from 'ethereumjs-wallet'
import * as ethSigUtil from 'eth-sig-util'

import * as Validation from '../../../../src/validate/v1/structure'
import {formatMerkleProofForShare} from '../../../../src/utils'

import {Holder, getHolder, buildBatchFullVCV1, buildOnChainFullVCV1, buildVerifiablePresentation, buildLegacyFullVCV1} from './utils'

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

const createSelectivelyDisclosableLegacyVCV1 = async ({issuer, holder}: {issuer: Buffer; holder: Holder}) => {
  return await buildSelectivelyDisclosableLegacyVCV1({
    dataNodes: [buildPhoneClaimNode(), buildEmailClaimNode()],
    subjectDID: `did:ethr:${holder.publicStringHex}`,
    issuanceDate: '2016-02-01T00:00:00.000Z',
    expirationDate: '2018-02-01T00:00:00.000Z',
    privateKey: issuer,
  })
}

const createLegacyFullVCV1 = async ({issuer, holder}: {issuer: Buffer; holder: Holder}) => {
  const sdvc = await createSelectivelyDisclosableLegacyVCV1({
    issuer,
    holder,
  })

  const fullVC = buildLegacyFullVCV1({
    subject: `did:ethr:${holder.publicStringHex}`,
    tx: '0xf1d6b6b64e63737a4ef023fadc57e16793cfae5d931a3c301d14e375e54fabf6',
    stage: 'mainnet',
    target: sdvc.credentialSubject.dataNodes[0],
    sdvc,
    authorization: [],
    holder,
  })

  return fullVC
}

const createSelectivelyDisclosableVCV1 = async ({issuer, holder}: {issuer: Buffer; holder: Holder}) => {
  return await buildSelectivelyDisclosableVCV1({
    claimNodes: [buildPhoneClaimNode(), buildEmailClaimNode()],
    subjectDID: `did:ethr:${holder.publicStringHex}`,
    issuanceDate: '2016-02-01T00:00:00.000Z',
    expirationDate: '2018-02-01T00:00:00.000Z',
    privateKey: issuer,
  })
}

const createFullVCV1 = async ({issuer, holder}: {issuer: Buffer; holder: Holder}) => {
  const sdvc = await createSelectivelyDisclosableVCV1({issuer, holder})

  const fullVC = await buildOnChainFullVCV1({
    subject: `did:ethr:${holder.publicStringHex}`,
    tx: '0xf1d6b6b64e63737a4ef023fadc57e16793cfae5d931a3c301d14e375e54fabf6',
    stage: 'mainnet',
    target: sdvc.credentialSubject.claimNodes[0],
    sdvc,
    authorization: [],
    holder,
  })

  return fullVC
}

const createBatchFullVCV1 = async ({issuer, holder}: {issuer: Buffer; holder: Holder}) => {
  const sdvc = await createSelectivelyDisclosableVCV1({issuer, holder})

  const contractAddress = '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
  const requestNonce = EthUtils.generateNonce()

  const subjectSignature = ethSigUtil.signTypedData(holder.private, {
    data: EthUtils.getAttestationAgreement(contractAddress, 1, sdvc.proof.layer2Hash, requestNonce),
  })

  const batchVC = await buildSelectivelyDisclosableBatchVCV1({
    credential: sdvc,
    privateKey: issuer,
    contractAddress,
    subjectSignature,
    requestNonce,
  })

  const batchFullVC = buildBatchFullVCV1({
    subject: `did:ethr:${holder.publicStringHex}`,
    stage: 'mainnet',
    target: batchVC.credentialSubject.claimNodes[0],
    sdvc: batchVC,
    authorization: [],
    holder,
  })

  return batchFullVC
}

const createVerifiablePresentationV1 = ({fullVCs, holder}: {fullVCs: FullVC[]; holder: Holder}) => {
  return buildVerifiablePresentation({
    fullCredentials: fullVCs,
    token: EthUtils.generateNonce(),
    domain: 'https://bloom.co/receiveData',
    holder,
  })
}

test('Validation.isValidPositionString', () => {
  expect(Validation.isValidPositionString('left')).toBeTruthy()
  expect(Validation.isValidPositionString('right')).toBeTruthy()
  expect(Validation.isValidPositionString('')).toBeFalsy()
  expect(Validation.isValidPositionString('up')).toBeFalsy()
})

test('Validation.isValidStageString', () => {
  expect(Validation.isValidStageString('mainnet')).toBeTruthy()
  expect(Validation.isValidStageString('rinkeby')).toBeTruthy()
  expect(Validation.isValidStageString('local')).toBeTruthy()
  expect(Validation.isValidStageString('')).toBeFalsy()
  expect(Validation.isValidStageString('home')).toBeFalsy()
})

test('Validation.isValidMerkleProofArray', () => {
  const testLeaves = EthUtils.getPadding(1)
  const validMerkleTree = EthUtils.getMerkleTreeFromLeaves(testLeaves)
  const validMerkleProof = validMerkleTree.getProof(EthU.toBuffer(testLeaves[1])) as IProof[]
  const shareableMerkleProof = formatMerkleProofForShare(validMerkleProof)
  expect(Validation.isValidMerkleProofArray(validMerkleProof, undefined)).toBeFalsy()
  expect(Validation.isValidMerkleProofArray(shareableMerkleProof, undefined)).toBeTruthy()
  expect(Validation.isValidMerkleProofArray([], undefined)).toBeFalsy()
})

test('Validation.isValidLegacyDataNode', async () => {
  const legacySdvc = await createSelectivelyDisclosableLegacyVCV1({
    issuer: issuerPrivKey,
    holder: getHolder(bobWallet),
  })

  const sdvc = await createSelectivelyDisclosableVCV1({
    issuer: issuerPrivKey,
    holder: getHolder(bobWallet),
  })

  expect(Validation.isValidLegacyDataNode(legacySdvc.credentialSubject.dataNodes[0])).toBeTruthy()
  expect(Validation.isValidLegacyDataNode(sdvc.credentialSubject.claimNodes[0] as any)).toBeFalsy()
})

test('Validation.isValidClaimNode', async () => {
  expect.assertions(2)

  const legacyFullVC = await createLegacyFullVCV1({
    issuer: issuerPrivKey,
    holder: getHolder(bobWallet),
  })

  const fullVC = await createFullVCV1({
    issuer: issuerPrivKey,
    holder: getHolder(bobWallet),
  })

  expect(Validation.isValidClaimNode(legacyFullVC.proof.data.target as any)).toBeFalsy()
  expect(Validation.isValidClaimNode(fullVC.proof.data.target as any)).toBeTruthy()
})

it('Validation.isValidVerifiedData', async () => {
  expect.assertions(2)

  const fullVC = await createFullVCV1({
    issuer: issuerPrivKey,
    holder: getHolder(bobWallet),
  })

  const batchFullVC = await createBatchFullVCV1({
    issuer: issuerPrivKey,
    holder: getHolder(bobWallet),
  })

  expect(Validation.isValidVerifiedData(fullVC.proof.data)).toBeTruthy()
  expect(Validation.isValidVerifiedData(batchFullVC.proof.data)).toBeTruthy()
})

test('Validation.validateCredentialSubject', async () => {
  expect.assertions(2)

  const fullVC = await createFullVCV1({
    issuer: issuerPrivKey,
    holder: getHolder(bobWallet),
  })

  const batchFullVC = await createBatchFullVCV1({
    issuer: issuerPrivKey,
    holder: getHolder(bobWallet),
  })

  expect(Utils.isValid(Validation.validateCredentialSubject)(fullVC.credentialSubject)).toBeTruthy()
  expect(Utils.isValid(Validation.validateCredentialSubject)(batchFullVC.credentialSubject)).toBeTruthy()
})

fit('Validation.validateVerifiableCredential', async () => {
  expect.assertions(2)

  const fullVC = await createFullVCV1({
    issuer: issuerPrivKey,
    holder: getHolder(bobWallet),
  })

  const batchFullVC = await createBatchFullVCV1({
    issuer: issuerPrivKey,
    holder: getHolder(bobWallet),
  })

  await expect(Utils.isAsyncValid(Validation.validateVerifiableCredential)(fullVC)).resolves.toBeTruthy()
  await expect(Utils.isAsyncValid(Validation.validateVerifiableCredential)(batchFullVC)).resolves.toBeTruthy()
})

test('Validation.validateVerifiablePresentationV1', async () => {
  expect.assertions(5)

  const legacyFullVC = await createLegacyFullVCV1({
    issuer: issuerPrivKey,
    holder: getHolder(bobWallet),
  })

  const fullVC = await createFullVCV1({
    issuer: issuerPrivKey,
    holder: getHolder(bobWallet),
  })

  const batchFullVC = await createBatchFullVCV1({
    issuer: issuerPrivKey,
    holder: getHolder(bobWallet),
  })

  const alicesFullVC = await createFullVCV1({
    issuer: issuerPrivKey,
    holder: getHolder(aliceWallet),
  })

  const legacyVerifiablePresentation = await createVerifiablePresentationV1({
    fullVCs: [legacyFullVC],
    holder: getHolder(bobWallet),
  })

  const verifiablePresentation = await createVerifiablePresentationV1({
    fullVCs: [fullVC],
    holder: getHolder(bobWallet),
  })

  const batchVerifiablePresentation = await createVerifiablePresentationV1({
    fullVCs: [batchFullVC],
    holder: getHolder(bobWallet),
  })

  const mixedVerifiablePresentation = await createVerifiablePresentationV1({
    fullVCs: [legacyFullVC, fullVC, batchFullVC],
    holder: getHolder(bobWallet),
  })

  const invalidVerifiablePresentation = await createVerifiablePresentationV1({
    fullVCs: [fullVC, alicesFullVC],
    holder: getHolder(bobWallet),
  })

  await expect(await Validation.validateVerifiablePresentationV1(legacyVerifiablePresentation)).resolves.toBeTruthy()
  await expect(await Validation.validateVerifiablePresentationV1(verifiablePresentation)).resolves.toBeTruthy()
  await expect(await Validation.validateVerifiablePresentationV1(batchVerifiablePresentation)).resolves.toBeTruthy()
  await expect(await Validation.validateVerifiablePresentationV1(mixedVerifiablePresentation)).resolves.toBeTruthy()
  await expect(await Validation.validateVerifiablePresentationV1(invalidVerifiablePresentation)).resolves.toBeFalsy()
})
