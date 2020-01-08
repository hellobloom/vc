import {
  genValidateFn,
  Utils,
  EthUtils,
  DataVersions,
  IMerkleProofShare,
  IProof,
  IVerifiablePresentation,
} from '@bloomprotocol/att-comms-kit'
import * as EthU from 'ethereumjs-util'

import {hashCredentials} from '../../utils'

export const isOptionalArrayOfAuthorizations = (value: any): boolean => {
  if (!Array.isArray(value)) return false
  return true
  // TODO add authorization validation
}

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

export const isValidMerkleProofArray = (value: any): boolean => {
  if (!Array.isArray(value)) return false
  if (value.length === 0) return false
  return value.every(v => validateProofShare(v).kind === 'validated')
}

export const isValidLegacyDataNode = (value: any): boolean => EthUtils.validateDataNodeLegacy(value).kind === 'validated'

export const validateVerifiedDataLegacy = genValidateFn({
  version: (value: any) => value === DataVersions.legacy,
  tx: EthUtils.isValidHash,
  layer2Hash: EthUtils.isValidHash,
  rootHash: EthUtils.isValidHash,
  rootHashNonce: EthUtils.isValidHash,
  proof: isValidMerkleProofArray,
  stage: isValidStageString,
  target: isValidLegacyDataNode,
  attester: EthU.isValidAddress,
})

export const isValidClaimNode = (value: any): boolean => EthUtils.validateClaimNode(value).kind === 'validated'

export const validateVerifiedDataOnChain = genValidateFn({
  version: (value: any) => value === DataVersions.onChain,
  tx: EthUtils.isValidHash,
  layer2Hash: EthUtils.isValidHash,
  rootHash: EthUtils.isValidHash,
  rootHashNonce: EthUtils.isValidHash,
  proof: isValidMerkleProofArray,
  stage: isValidStageString,
  target: isValidClaimNode,
  attester: EthU.isValidAddress,
})

export const validateVerifiedDataBatch = genValidateFn({
  version: (value: any) => value === DataVersions.batch,
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
  if (validateVerifiedDataLegacy(value).kind === 'validated') return true
  if (validateVerifiedDataOnChain(value).kind === 'validated') return true
  if (validateVerifiedDataBatch(value).kind === 'validated') return true
  return false
}

export const validateCredentialSubject = genValidateFn({
  subject: EthU.isValidAddress,
  data: Utils.isNotEmptyString,
  authorization: isOptionalArrayOfAuthorizations,
})

export const formatMerkleProofForVerify = (proof: IMerkleProofShare[]): IProof[] =>
  proof.map(node => ({
    position: node.position,
    data: EthU.toBuffer(EthU.addHexPrefix(node.data)),
  }))

export const verifyCredentialMerkleProof = (value: any) => {
  const proof = formatMerkleProofForVerify(value.proof)
  let targetNode: Buffer
  switch (value.version) {
    case DataVersions.legacy:
      targetNode = EthU.toBuffer(EthUtils.hashMessage(value.target.signedAttestation))
      break
    case DataVersions.onChain:
    case DataVersions.batch:
      targetNode = EthU.toBuffer(EthUtils.hashMessage(value.target.attesterSig))
      break
    default:
      return false
  }
  const root = EthU.toBuffer(value.rootHash)

  return EthUtils.verifyMerkleProof(proof, targetNode, root)
}

export const validateCredentialProof = genValidateFn({
  type: Utils.isNotEmptyString,
  created: EthUtils.isValidRFC3339DateTime,
  creator: EthU.isValidAddress,
  data: [isValidVerifiedData, verifyCredentialMerkleProof],
})

export const proofMatchesSubject = (value: any, data: any) => {
  switch (value.data.version) {
    case DataVersions.legacy:
      return value.data.target.attestationNode.data.data === data.credentialSubject.data
    case DataVersions.onChain:
    case DataVersions.batch:
      return value.data.target.claimNode.data.data === data.credentialSubject.data
    default:
      return false
  }
}

export const isValidCredentialProof = (value: any): boolean => validateCredentialProof(value).kind === 'validated'

export const isValidCredentialSubject = (value: any): boolean => validateCredentialSubject(value).kind === 'validated'

export const validateVerifiableCredential = genValidateFn({
  id: Utils.isNotEmptyString,
  type: EthUtils.isValidTypeString,
  issuer: EthU.isValidAddress,
  issuanceDate: EthUtils.isValidRFC3339DateTime,
  credentialSubject: isValidCredentialSubject,
  proof: [isValidCredentialProof, proofMatchesSubject],
})

export const validatePresentationProof = genValidateFn({
  type: Utils.isNotEmptyString,
  created: EthUtils.isValidRFC3339DateTime,
  creator: EthU.isValidAddress,
  nonce: Utils.isNotEmptyString,
  domain: Utils.isNotEmptyString,
  credentialHash: EthUtils.isValidHash,
})

export const isArrayOfVerifiableCredentials = (value: any): boolean => {
  if (!Array.isArray(value)) return false
  if (value.length === 0) return false
  return value.every(v => validateVerifiableCredential(v).kind === 'validated')
}

export const isValidPresentationProof = (value: any): boolean => validatePresentationProof(value).kind === 'validated'

export const proofMatchesCredential = (value: any, data: any) => {
  return value.credentialHash.toLowerCase() === hashCredentials(data.verifiableCredential)
}

export const packedDataMatchesProof = (value: string, data: any) => {
  return value.toLowerCase() === EthUtils.hashMessage(Utils.orderedStringify(data.proof))
}

export const tokenMatchesProof = (value: string, data: any) => {
  return value.toLowerCase() === data.proof.nonce.toLowerCase()
}

export const validatePresentationSignature = (value: string, data: any) => {
  const recoveredSigner = EthUtils.recoverHashSigner(EthU.toBuffer(data.packedData), value)
  return recoveredSigner.toLowerCase() === data.proof.creator.toLowerCase()
}

export const validateVerifiablePresentation = genValidateFn<IVerifiablePresentation>({
  context: Utils.isArrayOfNonEmptyStrings,
  type: (value: any) => value === 'VerifiablePresentation',
  verifiableCredential: isArrayOfVerifiableCredentials,
  proof: [isValidPresentationProof, proofMatchesCredential],
  packedData: packedDataMatchesProof,
  signature: [EthUtils.isValidSignatureString, validatePresentationSignature],
  token: tokenMatchesProof,
})
