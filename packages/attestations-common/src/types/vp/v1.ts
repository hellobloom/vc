import {BaseVCV1} from '../vc/shared/v1'

export type VerifiablePresentationTypeV1 = ['VerifiablePresentation', ...string[]]

export type VerifiablePresentationProofV1 = {
  type: string
  created: string
  proofPurpose: 'authentication'
  verificationMethod: string
  challenge: string
  domain: string
  jws: string
}

// TODO: This is missing the `signature` and `packedData` fields. How should those translate over?
export type VerifiablePresentationV1<VC extends BaseVCV1 = BaseVCV1> = {
  '@context': string[]
  type: VerifiablePresentationTypeV1
  verifiableCredential: VC[]
  holder: string
  proof: VerifiablePresentationProofV1
}
