import {BaseVCV1, BaseVCTypeV1, BaseVCSubjectV1, VCSignedClaimNodeV1, VCLegacySignedDataNodeV1} from '../shared/v1'

// Legacy

export type SDLegacyVCTypeV1 = [BaseVCTypeV1[0], 'SDVerifiableLegacyCredential', ...string[]]

export type SDLegacyVCSubjectV1 = BaseVCSubjectV1 & {
  dataNodes: VCLegacySignedDataNodeV1[]
}

export type SDLegacyVCProofV1 = {
  layer2Hash: string
  signedRootHash: string
  rootHashNonce: string
  rootHash: string
  checksumSig: string
  paddingNodes: string[]
}

export type SDLegacyVCV1 = BaseVCV1<
  SDLegacyVCTypeV1,
  SDLegacyVCSubjectV1,
  SDLegacyVCProofV1
> & {
  version: 'SDLegacyVC-1.0.0'
}

// Regular

export type SDVCTypeV1 = [BaseVCTypeV1[0], 'SDVerifiableCredential', ...string[]]

export type SDVCSubjectV1 = BaseVCSubjectV1 & {
  claimNodes: VCSignedClaimNodeV1[]
}

export type SDVCProofV1 = {
  issuerSignature: string
  layer2Hash: string
  checksumSignature: string
  paddingNodes: string[]
  rootHash: string
  rootHashNonce: string
}

export type SDVCV1<
  Subject extends SDVCSubjectV1 = SDVCSubjectV1,
  Type extends SDVCTypeV1 = SDVCTypeV1,
  Proof extends SDVCProofV1 = SDVCProofV1
> = BaseVCV1<Type, Subject, Proof> & {
  version: 'SDVC-1.0.0'
}

// Batch

export type SDBatchVCTypeV1 = [
  SDVCTypeV1[0],
  SDVCTypeV1[1],
  'SDBatchVerifiableCredential',
  ...string[],
]

export type SDBatchVCSubjectV1 = SDVCSubjectV1

export type SDBatchVCProofV1 = SDVCProofV1 & {
  batchIssuerSignature: string
  batchLayer2Hash: string
  contractAddress: string
  requestNonce: string
  subjectSignature: string
}

export type SDBatchVCV1<
  Subject extends SDBatchVCSubjectV1 = SDBatchVCSubjectV1,
  Type extends SDBatchVCTypeV1 = SDBatchVCTypeV1,
  Proof extends SDBatchVCProofV1 = SDBatchVCProofV1
> = BaseVCV1<Type, Subject, Proof> & {
  version: 'SDBatchVC-1.0.0'
}
