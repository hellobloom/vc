import {
  genValidateFn,
  Utils,
  EthUtils,
  VerifiablePresentationV1,
  FullVCV1,
  VerifiablePresentationProofV1,
  FullVCSubjectV1,
  FullVCAuthorizationV1,
  FullVCProofV1,
  FullVCVerifiedDataBatchV1,
} from '@bloomprotocol/attestations-common'
import * as EthU from 'ethereumjs-util'

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
  id: EthUtils.isValidDID,
  data: Utils.isNotEmptyString,
  authorization: Utils.isArrayOf(Utils.isValid(validateAuthorization), false),
})

const validateCredentialProof = genValidateFn<FullVCProofV1>({
  type: Utils.isNotEmptyString,
  created: Utils.isValidRFC3339DateTime,
  proofPurpose: (value: any) => value === 'assertionMethod',
  verificationMethod: EthU.isValidAddress,
  jws: Utils.isNotEmptyString,
  data: isValidVerifiedData,
})

const isCredentialProofValid = (_: any, __: any) => {
  // TODO verify the proof's JWS with jsonld-signatures
  return true
}

const validateVerifiableCredential = genValidateFn<FullVCV1>({
  '@context': Utils.isArrayOfNonEmptyStrings,
  id: Utils.isNotEmptyString,
  type: [Utils.isArrayOfNonEmptyStrings, (value: any) => value[0] === 'VerifiableCredential' && value[1] === 'FullCredential'],
  issuer: EthUtils.isValidDID,
  issuanceDate: Utils.isValidRFC3339DateTime,
  expirationDate: Utils.isUndefinedOr(Utils.isValidRFC3339DateTime),
  credentialSubject: Utils.isValid(validateCredentialSubject),
  proof: [Utils.isValid(validateCredentialProof), isCredentialProofValid],
})

const validateProof = genValidateFn<VerifiablePresentationProofV1>({
  type: Utils.isNotEmptyString,
  created: Utils.isValidRFC3339DateTime,
  proofPurpose: (value: any) => value === 'authentication',
  verificationMethod: EthU.isValidAddress,
  challenge: Utils.isNotEmptyString,
  domain: Utils.isNotEmptyString,
  jws: Utils.isNotEmptyString,
})

const isPresentationProofValid = (_: any, __: any) => {
  // TODO verify the proof's JWS with jsonld-signatures
  return true
}

export const validateVerifiablePresentationV1 = genValidateFn<VerifiablePresentationV1<FullVCV1>>({
  '@context': Utils.isArrayOfNonEmptyStrings,
  type: [Utils.isArrayOfNonEmptyStrings, (value: any) => value[0] === 'VerifiablePresentation'],
  verifiableCredential: Utils.isArrayOf(Utils.isValid(validateVerifiableCredential)),
  holder: [EthUtils.isValidDID],
  proof: [Utils.isValid(validateProof), isPresentationProofValid],
})
