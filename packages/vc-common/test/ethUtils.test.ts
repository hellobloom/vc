import EthWallet from 'ethereumjs-wallet'
import * as ethSigUtil from 'eth-sig-util'

import * as EthUtils from '../src/ethUtils'
import {IAttestationData, IAttestationType, IIssuanceNode, IAttestationLegacy, IIssuedClaimNode} from '../src/types'

const aliceWallet = EthWallet.fromPrivateKey(new Buffer('c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3', 'hex'))
const alicePrivkey = aliceWallet.getPrivateKey()
const bobWallet = EthWallet.fromPrivateKey(new Buffer('ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f', 'hex'))

const bobPrivkey = bobWallet.getPrivateKey()
const bobAddress = bobWallet.getAddressString()

const emailAttestationData: IAttestationData = {
  data: 'test@bloom.co',
  nonce: 'a3877038-79a9-477d-8037-9826032e6af0',
  version: '1.0.0',
}

const emailAttestationType: IAttestationType = {
  type: 'email',
  nonce: 'a3877038-79a9-477d-8037-9826032e6af1',
  provider: 'Bloom',
}

const emailIssuanceNode: IIssuanceNode = {
  localRevocationToken: '0x5a35e46865c7a4e0a5443b03d17d60c528896881646e6d58d3c4ad90ef84448e',
  globalRevocationToken: '0xe04448fe19da4c3d85d6e646188628825c86d71b30b5445a0e4a7c56864e53a7',
  dataHash: '0xd1696aa0222c2ee299efa58d265eaecc4677d8c88cb3a5c7e60bc5957fff514a',
  typeHash: '0x5aa3911df2dd532a0a03c7c6b6a234bb435a31dd9616477ef6cddacf014929df',
  issuanceDate: '2016-02-01T00:00:00.000Z',
  expirationDate: '2018-02-01T00:00:00.000Z',
}

const emailAuxHash = '0x3a25e46865c7a4e0a5445b03b17d68c529826881647e6d58d3c4ad91ef83440f'

const emailAttestation: IAttestationLegacy = {
  data: emailAttestationData,
  type: emailAttestationType,
  aux: emailAuxHash,
}

const emailIssuedClaimNode: IIssuedClaimNode = {
  data: emailAttestationData,
  type: emailAttestationType,
  aux: emailAuxHash,
  issuance: emailIssuanceNode,
}

const phoneAttestationData: IAttestationData = {
  data: '+17203600587',
  nonce: 'a3877038-79a9-477d-8037-9826032e6af0',
  version: '1.0.0',
}
const phoneAttestationType: IAttestationType = {
  type: 'phone',
  nonce: 'a3877038-79a9-477d-8037-9826032e6af0',
  provider: 'Bloom',
}

const phoneAuxHash = '0x303438fe19da4c3d85d6e746188618925c86d71b30b5443a0e4a7c56864e52b5'

const phoneAttestation: IAttestationLegacy = {
  data: phoneAttestationData,
  type: phoneAttestationType,
  aux: phoneAuxHash,
}

const contractAddress = '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'

const legacyComponents = EthUtils.getSignedMerkleTreeComponentsLegacy([emailAttestation, phoneAttestation], alicePrivkey)

const components = EthUtils.getSignedMerkleTreeComponents(
  [emailAttestation, phoneAttestation],
  emailIssuedClaimNode.issuance.issuanceDate,
  emailIssuedClaimNode.issuance.expirationDate,
  alicePrivkey,
)

const requestNonce = EthUtils.generateNonce()

const bobSubjectSig = ethSigUtil.signTypedData(bobPrivkey, {
  data: EthUtils.getAttestationAgreement(contractAddress, 1, components.layer2Hash, requestNonce),
})

const batchComponents = EthUtils.getSignedBatchMerkleTreeComponents(
  components,
  contractAddress,
  bobSubjectSig,
  bobAddress,
  requestNonce,
  alicePrivkey,
)

test('EthUtils.validateBloomMerkleTreeComponents', () => {
  const validated = EthUtils.validateBloomMerkleTreeComponents(components)
  expect(validated.kind).toBe('validated')
})

test('HashingLogic.getSignedBatchMerkleTreeComponents', () => {
  const validated = EthUtils.validateBloomBatchMerkleTreeComponents(batchComponents)
  expect(validated.kind).toBe('validated')
})

test('EthUtils.isValidEthHexString', () => {
  expect(EthUtils.isValidEthHexString('abc')).toBeFalsy()
  expect(EthUtils.isValidEthHexString('0xabc')).toBeTruthy()
})

test('EthUtils.isValidHash', () => {
  expect(EthUtils.isValidHash('abc')).toBeFalsy()
  expect(EthUtils.isValidHash('9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658')).toBeFalsy()
  expect(EthUtils.isValidHash('0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb65')).toBeFalsy()
  expect(EthUtils.isValidHash('0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658')).toBeTruthy()
})

test('EthUtils.isArrayOfPaddingNodes', () => {
  const validPadding = EthUtils.getPadding(1)
  expect(EthUtils.isArrayOfPaddingNodes(validPadding)).toBeTruthy()
  expect(EthUtils.isArrayOfPaddingNodes([])).toBeFalsy()
  const invalidPadding = validPadding.map(a => a.substring(0, Math.round(Math.random() * a.length)))
  expect(EthUtils.isArrayOfPaddingNodes(invalidPadding)).toBeFalsy()
})

test('EthUtils.isValidTypeString', () => {
  expect(EthUtils.isValidTypeString('phone')).toBeTruthy()
  expect(EthUtils.isValidTypeString('sms')).toBeFalsy()
})

test('EthUtils.validateAttesterClaimSig', () => {
  expect(EthUtils.validateAttesterClaimSig(components.claimNodes[0].attesterSig, components.claimNodes[0])).toBeTruthy()
  expect(EthUtils.validateAttesterClaimSig(components.claimNodes[0].attesterSig, components.claimNodes[1])).toBeFalsy()
})

test('EthUtils.validateAttesterRootSig', () => {
  expect(EthUtils.validateAttesterRootSig(components.attesterSig, components)).toBeTruthy()
  expect(EthUtils.validateAttesterRootSig(components.claimNodes[0].attesterSig, components)).toBeFalsy()
})

test('EthUtils.validateBatchAttesterSig', () => {
  expect(EthUtils.validateBatchAttesterSig(batchComponents.batchAttesterSig, batchComponents)).toBeTruthy()
  expect(EthUtils.validateBatchAttesterSig(batchComponents.attesterSig, batchComponents)).toBeFalsy()
})

test('EthUtils.validateSubjectSig', () => {
  expect(EthUtils.validateSubjectSig(batchComponents.subjectSig, batchComponents)).toBeTruthy()
  expect(EthUtils.validateSubjectSig(batchComponents.attesterSig, batchComponents)).toBeFalsy()
})

test('EthUtils.validateChecksumSig', () => {
  expect(EthUtils.validateChecksumSig(batchComponents.checksumSig, batchComponents)).toBeTruthy()
  expect(EthUtils.validateChecksumSig(batchComponents.attesterSig, batchComponents)).toBeFalsy()
  expect(EthUtils.validateChecksumSig(components.checksumSig, components)).toBeTruthy()
  expect(EthUtils.validateChecksumSig(components.attesterSig, components)).toBeFalsy()
})

test('EthUtils.isValidSignatureString', () => {
  expect(EthUtils.isValidSignatureString(components.attesterSig)).toBeTruthy()
  expect(EthUtils.isValidSignatureString(components.rootHashNonce)).toBeFalsy()
})

test('EthUtils.isValidArrayOfClaimNodes', () => {
  expect(EthUtils.isValidArrayOfClaimNodes(components.claimNodes)).toBeTruthy()
  expect(EthUtils.isValidArrayOfClaimNodes(components.paddingNodes)).toBeFalsy()
  expect(EthUtils.isValidArrayOfClaimNodes([])).toBeFalsy()
})

test('EthUtils.isValidArrayOfLegacyDataNodes', () => {
  expect(EthUtils.isValidArrayOfLegacyDataNodes(legacyComponents.dataNodes)).toBeTruthy()
  expect(EthUtils.isValidArrayOfLegacyDataNodes(components.claimNodes)).toBeFalsy()
  expect(EthUtils.isValidArrayOfLegacyDataNodes([])).toBeFalsy()
})
