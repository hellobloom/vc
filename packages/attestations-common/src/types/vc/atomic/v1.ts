import {BaseVCV1, BaseVCTypeV1, BaseVCSubjectV1, BaseVCProofV1, BaseVCRevocationV1} from '../shared/v1'

export type AtomicVCSubjectV1<D extends {} = {}> = BaseVCSubjectV1 & D

export type AtomicVCProofV1 = Omit<BaseVCProofV1, 'proofPurpose'> & {
  proofPurpose: 'assertionMethod'
}

export type AtomicVCV1<
  Subject extends AtomicVCSubjectV1 = AtomicVCSubjectV1,
  Type extends BaseVCTypeV1 = BaseVCTypeV1,
  Proof extends AtomicVCProofV1 = AtomicVCProofV1,
  Revocation extends BaseVCRevocationV1 = BaseVCRevocationV1
> = BaseVCV1<Subject, Type, Proof, Revocation>
