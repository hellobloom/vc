import {BaseVCV1} from '../vc/shared/v1'

export type VerifiablePresentationTypeV1 = ['VerifiablePresentation', ...string[]]

export type VerifiablePresentationProofMetaDataV1 = {
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

export type VerifiablePresentationProofV1 = {
  metaData: VerifiablePresentationProofMetaDataV1
  /**
   * Hex string representation of the `metaData` being keccak256 hashed
   */
  packedData: string
  /**
   * Signature of `packedData` by the user with their pk.
   */
  signature: string
}

// TODO: This is missing the `signature` and `packedData` fields. How should those translate over?
export type VerifiablePresentationV1<VC extends BaseVCV1 = BaseVCV1> = {
  '@context': string[]
  type: VerifiablePresentationTypeV1
  verifiableCredential: VC[]
  proof: VerifiablePresentationProofV1
}
