import {BaseVCV1} from '../vc/shared/v1'

export type VerifiablePresentationTypeV1 = ['VerifiablePresentation', ...string[]]

export type VerifiablePresentationProofV1 = {
  // type string describing share kit style proof
  type: string
  // recent timestamp in RFC3339 format
  created: string
  /**
   * The Ethereum address of the user sharing their data
   * TODO DID
   */
  creator: string
  // token challenge from recipient
  nonce: string
  // host of recipient endpoint
  domain: string

  // hash of ordered array of layer2Hashes from each credential proof
  credentialHash: string
}

// TODO: This is missing the `signature` and `packedData` fields. How should those translate over?
export type VerifiablePresentationV1<VC extends BaseVCV1 = BaseVCV1> = {
  '@context': string[]
  type: VerifiablePresentationTypeV1
  verifiableCredential: VC[]
  proof: VerifiablePresentationProofV1
}
