import {BaseVCV1, BaseVCTypeV1, BaseVCSubjectV1, VCSignedClaimNodeV1, VCLegacySignedDataNodeV1} from '../shared/v1'

// Legacy

export type SelectivelyDisclosableLegacyVCTypeV1 = [BaseVCTypeV1[0], 'SelectivelyDisclosableVerifiableLegacyCredential', ...string[]]

export type SelectivelyDisclosableLegacyVCSubjectV1 = BaseVCSubjectV1 & {
  dataNodes: VCLegacySignedDataNodeV1[]
}

export type SelectivelyDisclosableLegacyVCProofV1 = {
  layer2Hash: string
  signedRootHash: string
  rootHashNonce: string
  rootHash: string
  checksumSig: string
  paddingNodes: string[]
}

export type SelectivelyDisclosableLegacyVCV1 = BaseVCV1<
  SelectivelyDisclosableLegacyVCTypeV1,
  SelectivelyDisclosableLegacyVCSubjectV1,
  SelectivelyDisclosableLegacyVCProofV1
> & {
  version: 'SelectivelyDisclosableLegacyVC-1.0.0'
}

// Regular

export type SelectivelyDisclosableVCTypeV1 = [BaseVCTypeV1[0], 'SelectivelyDisclosableVerifiableCredential', ...string[]]

export type SelectivelyDisclosableVCSubjectV1 = BaseVCSubjectV1 & {
  claimNodes: VCSignedClaimNodeV1[]
}

export type SelectivelyDisclosableVCProofV1 = {
  issuerSignature: string
  layer2Hash: string
  checksumSignature: string
  paddingNodes: string[]
  rootHash: string
  rootHashNonce: string
}

export type SelectivelyDisclosableVCV1 = BaseVCV1<
  SelectivelyDisclosableVCTypeV1,
  SelectivelyDisclosableVCSubjectV1,
  SelectivelyDisclosableVCProofV1
> & {
  version: 'SelectivelyDisclosableVC-1.0.0'
}

// Batch

export type SelectivelyDisclosableBatchVCTypeV1 = [
  SelectivelyDisclosableVCTypeV1[0],
  SelectivelyDisclosableVCTypeV1[1],
  'SelectivelyDisclosableBatchVerifiableCredential',
  ...string[],
]

export type SelectivelyDisclosableBatchVCSubjectV1 = SelectivelyDisclosableVCSubjectV1

export type SelectivelyDisclosableBatchVCProofV1 = SelectivelyDisclosableVCProofV1 & {
  batchIssuerSignature: string
  batchLayer2Hash: string
  contractAddress: string
  requestNonce: string
  subjectSignature: string
}

export type SelectivelyDisclosableBatchVCV1 = BaseVCV1<
  SelectivelyDisclosableBatchVCTypeV1,
  SelectivelyDisclosableBatchVCSubjectV1,
  SelectivelyDisclosableBatchVCProofV1
> & {
  version: 'SelectivelyDisclosableBatchVC-1.0.0'
}
