import {
  genValidateFn,
  Utils,
  EthUtils,
  VerifiablePresentationV1,
  FullVCV1,
  VerifiablePresentationProofV1,
  VerifiablePresentationProofMetaDataV1,
  FullVCSubjectV1,
  FullVCAuthorizationV1,
  FullVCProofV1,
  FullVCVerifiedDataBatchV1,
} from '@bloomprotocol/attestations-common'
import * as EthU from 'ethereumjs-util'

import {hashCredentials} from '../../../utils'

export const isValidPositionString = (value: any): boolean => {
  return ['left', 'right'].indexOf(value) > -1
}

export const isValidStageString = (value: any): boolean => {
  return ['mainnet', 'rinkeby', 'local'].indexOf(value) > -1
}

export const validateProofShare = genValidateFn({
  position: isValidPositionString,
  data: EthUtils.isValidHash,
})

export const isValidMerkleProofArray = Utils.isArrayOf(Utils.isValid(validateProofShare))

export const isValidClaimNode = Utils.isValid(EthUtils.validateClaimNode)

export const isValidLegacyDataNode = Utils.isValid(EthUtils.validateDataNodeLegacy)

export const validateVerifiedDataLegacy = genValidateFn({
  version: (value: any) => value === 'legacy',
  tx: EthUtils.isValidHash,
  layer2Hash: EthUtils.isValidHash,
  rootHash: EthUtils.isValidHash,
  rootHashNonce: EthUtils.isValidHash,
  proof: isValidMerkleProofArray,
  stage: isValidStageString,
  target: isValidLegacyDataNode,
  attester: EthU.isValidAddress,
})

export const validateVerifiedDataOnChain = genValidateFn({
  version: (value: any) => value === 'onChain',
  tx: EthUtils.isValidHash,
  layer2Hash: EthUtils.isValidHash,
  rootHash: EthUtils.isValidHash,
  rootHashNonce: EthUtils.isValidHash,
  proof: isValidMerkleProofArray,
  stage: isValidStageString,
  target: isValidClaimNode,
  attester: EthU.isValidAddress,
})

export const validateVerifiedDataBatch = genValidateFn<FullVCVerifiedDataBatchV1>({
  version: (value: any) => value === 'batch',
  batchLayer2Hash: EthUtils.isValidHash,
  batchAttesterSig: EthUtils.isValidSignatureString,
  subjectSig: EthUtils.isValidSignatureString,
  requestNonce: EthUtils.isValidHash,
  layer2Hash: EthUtils.isValidHash,
  rootHash: EthUtils.isValidHash,
  rootHashNonce: EthUtils.isValidHash,
  proof: isValidMerkleProofArray,
  stage: isValidStageString,
  target: isValidClaimNode,
  attester: EthU.isValidAddress,
  subject: EthU.isValidAddress,
})

export const isValidVerifiedData = (value: any): boolean => {
  if (Utils.isValid(validateVerifiedDataLegacy)(value)) return true
  if (Utils.isValid(validateVerifiedDataOnChain)(value)) return true
  if (Utils.isValid(validateVerifiedDataBatch)(value)) return true
  return false
}

const validateAuthorization = genValidateFn<FullVCAuthorizationV1>({
  subject: EthU.isValidAddress,
  recipient: EthU.isValidAddress,
  revocation: Utils.isNotEmptyString,
})

const validateCredentialSubject = genValidateFn<FullVCSubjectV1>({
  id: EthU.isValidAddress,
  data: Utils.isNotEmptyString,
  authorization: Utils.isArrayOf(Utils.isValid(validateAuthorization), false),
})

const validateCredentialProof = genValidateFn<FullVCProofV1>({
  type: Utils.isNotEmptyString,
  created: Utils.isValidRFC3339DateTime,
  creator: EthU.isValidAddress,
  data: isValidVerifiedData,
})

const validateVerifiableCredential = genValidateFn<FullVCV1>({
  '@context': Utils.isArrayOfNonEmptyStrings,
  id: Utils.isNotEmptyString,
  type: [
    Utils.isArrayOfNonEmptyStrings,
    (value: any) =>
      value[0] === 'VerifiableCredential' && value[1] === 'FullCredential' && value.splice(2).every(EthUtils.isValidTypeString),
  ],
  issuer: EthU.isValidAddress,
  issuanceDate: Utils.isValidRFC3339DateTime,
  expirationDate: Utils.isUndefinedOr(Utils.isValidRFC3339DateTime),
  credentialSubject: Utils.isValid(validateCredentialSubject),
  proof: Utils.isValid(validateCredentialProof),
})

const validateProofMetaData = genValidateFn<VerifiablePresentationProofMetaDataV1>({
  type: Utils.isNotEmptyString,
  created: Utils.isValidRFC3339DateTime,
  creator: EthU.isValidAddress,
  nonce: Utils.isNotEmptyString,
  domain: Utils.isNotEmptyString,
  credentialHash: EthUtils.isValidHash,
})

const packedDataMatchesProof = (value: any, data: any) => {
  return value.toLowerCase() === EthUtils.hashMessage(Utils.orderedStringify(data.metaData))
}

export const validatePresentationSignature = (value: string, data: any) => {
  const recoveredSigner = EthUtils.recoverHashSigner(EthU.toBuffer(data.packedData), value)
  return recoveredSigner.toLowerCase() === data.metaData.creator.toLowerCase()
}

const validateProof = genValidateFn<VerifiablePresentationProofV1>({
  metaData: Utils.isValid(validateProofMetaData),
  packedData: packedDataMatchesProof,
  signature: [EthUtils.isValidSignatureString, validatePresentationSignature],
})

const proofMatchesCredential = (value: any, data: any) => {
  return value.credentialHash.toLowerCase() === hashCredentials(data.verifiableCredential)
}

export const validateVerifiablePresentationV1 = genValidateFn<VerifiablePresentationV1<FullVCV1>>({
  '@context': Utils.isArrayOfNonEmptyStrings,
  type: [Utils.isArrayOfNonEmptyStrings, (value: any) => value[0] === 'VerifiablePresentation'],
  verifiableCredential: Utils.isArrayOf(Utils.isValid(validateVerifiableCredential)),
  proof: [proofMatchesCredential, Utils.isValid(validateProof)],
})
