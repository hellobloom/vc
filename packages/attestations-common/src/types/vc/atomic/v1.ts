import {BaseVCV1, BaseVCTypeV1, BaseVCSubjectV1, BaseVCProofSignedV1, BaseVCRevocationV1, BaseVCRevocationSimpleV1} from '../shared/v1'

export type AtomicVCTypeV1 = [BaseVCTypeV1[0], 'AtomicCredential', ...string[]]

export type AtomicVCSubjectV1 = BaseVCSubjectV1

export type AtomicVCProofV1 = BaseVCProofSignedV1 & {
  proofPurpose: 'assertionMethod'
}

export type AtomicVCV1<
  Subject extends AtomicVCSubjectV1 = AtomicVCSubjectV1,
  Type extends AtomicVCTypeV1 = AtomicVCTypeV1,
  Proof extends AtomicVCProofV1 = AtomicVCProofV1,
  Revocation extends BaseVCRevocationV1 = BaseVCRevocationSimpleV1
> = BaseVCV1<Subject, Type, Proof, Revocation>
