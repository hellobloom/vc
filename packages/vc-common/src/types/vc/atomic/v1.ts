import {
  BaseVCV1,
  BaseVCTypeV1,
  BaseVCSubjectV1,
  BaseVCProofV1,
  BaseVCRevocationSimpleV1,
  SimpleThing,
  BaseVCRevocationV1,
} from '../shared/v1'

export type AtomicVCSubjectV1<Type extends SimpleThing> = BaseVCSubjectV1<Type>

export type AtomicVCTypeV1 = BaseVCTypeV1

export type AtomicVCProofV1 = BaseVCProofV1

export type AtomicVCV1<
  Subject extends AtomicVCSubjectV1<SimpleThing> = AtomicVCSubjectV1<SimpleThing>,
  Type extends AtomicVCTypeV1 = BaseVCTypeV1,
  Proof extends AtomicVCProofV1 = BaseVCProofV1,
  Revocation extends BaseVCRevocationV1 = BaseVCRevocationSimpleV1
> = BaseVCV1<Subject, Type, Proof, Revocation>
