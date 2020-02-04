import {BaseVCV1, BaseVCTypeV1, BaseVCSubjectV1, BaseVCProofV1, BaseVCRevocationSimpleV1, BaseVCRevocationV1} from '../shared/v1'

// Do not import {Thing} from 'schema-dts' because it chokes TS
export type SimpleThing = {'@type': string} | string

export type AtomicVCSubjectV1<Type extends SimpleThing = SimpleThing> = BaseVCSubjectV1<Type>

export type AtomicVCTypeV1 = BaseVCTypeV1

export type AtomicVCProofV1 = BaseVCProofV1

export type AtomicVCV1<
  Subject extends AtomicVCSubjectV1 = AtomicVCSubjectV1,
  Type extends AtomicVCTypeV1 = BaseVCTypeV1,
  Proof extends AtomicVCProofV1 = BaseVCProofV1,
  Revocation extends BaseVCRevocationV1 = BaseVCRevocationSimpleV1
> = BaseVCV1<Subject, Type, Proof, Revocation>
