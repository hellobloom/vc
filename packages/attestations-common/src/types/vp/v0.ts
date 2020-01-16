import {IVerifiableCredential} from '../vc/full/v0'

export interface IPresentationProof {
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

export interface IVerifiablePresentation {
  // TODO context document
  context: string[]
  type: 'VerifiablePresentation'
  verifiableCredential: IVerifiableCredential[]
  proof: IPresentationProof

  /**
   * Hex string representation of the `proof` being keccak256 hashed
   */
  packedData: string

  /**
   * Signature of `packedData` by the user with their pk.
   */
  signature: string

  /**
   * Token that should match the one provided to the share-kit QR code.
   * same as nonce in proof
   */
  token: string
}
