import {BaseVCV1, BaseVCV1Type, BaseVCV1Subject, BaseVCV1Proof, BaseVCV1Revocation, SimpleThing, BaseVCV1Holder} from './base/v1'

export type VCV1Subject<Data extends SimpleThing> = BaseVCV1Subject<Data>

export type VCV1Holder = BaseVCV1Holder

export type VCV1Type = BaseVCV1Type

export type VCV1Proof = BaseVCV1Proof

export type VCV1Revocation = BaseVCV1Revocation

export type VCV1<Subject extends VCV1Subject<SimpleThing> = VCV1Subject<SimpleThing>> = BaseVCV1<
  Subject,
  VCV1Type,
  VCV1Proof,
  VCV1Revocation,
  VCV1Holder
>
