import {BaseVCV1, BaseVCV1Type, BaseVCV1Subject, BaseVCV1Proof, BaseVCV1RevocationSimple, SimpleThing, BaseVCV1Revocation} from './base/v1'

export type VCV1Subject<Type extends SimpleThing> = BaseVCV1Subject<Type>

export type VCV1Type = BaseVCV1Type

export type VCV1ProofV1 = BaseVCV1Proof

export type VCV1<
  Subject extends VCV1Subject<SimpleThing> = VCV1Subject<SimpleThing>,
  Type extends VCV1Type = BaseVCV1Type,
  Proof extends VCV1ProofV1 = BaseVCV1Proof,
  Revocation extends BaseVCV1Revocation = BaseVCV1RevocationSimple
> = BaseVCV1<Subject, Type, Proof, Revocation>
