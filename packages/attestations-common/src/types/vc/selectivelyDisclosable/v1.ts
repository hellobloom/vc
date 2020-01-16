import {BaseVCV1, BaseVCTypeV1, BaseVCSubjectV1, VCSignedClaimNodeV1} from '../shared/v1'

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
