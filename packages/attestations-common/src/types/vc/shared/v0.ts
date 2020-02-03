import {TAttestationTypeNames} from '../../attestation'

export interface IAttestationData {
  /** String representation of the attestations data.
   *
   * ### Examples ###
   * email: "test@bloom.co"
   * sanction-screen: {\"firstName\":\"FIRSTNAME\",\"middleName\":\"MIDDLENAME\",\"lastName\":\"LASTNAME\",\"birthMonth\":1,\"birthDay\":1,\"birthYear\":1900,\"id\":\"a1a1a1a...\"}
   *
   * Any attestation that isn't a single string value will be * a JSON string representing the attestation data.
   */
  // tslint:enable:max-line-length
  data: string
  /** Attestation data nonce
   */
  nonce: string
  /** Semantic version used to keep track of attestation versions
   */
  version: string
}

export interface IAttestationType {
  /** The type of attestation (phone, email, etc.)
   */
  type: TAttestationTypeNames
  /** Optionally identifies service used to perform attestation
   */
  provider?: string
  /** Attestation type nonce
   */
  nonce: string
}

export interface IRevocationLinks {
  /** Hex string to identify this attestation node in the event of partial revocation
   */
  local: string
  /** Hex string to identify this attestation in the event of revocation
   */
  global: string
  /** hash of data node attester is verifying
   */
  dataHash: string
  /** hash of type node attester is verifying
   */
  typeHash: string
}

export interface IAttestationLegacy {
  data: IAttestationData
  type: IAttestationType
  /** aux either contains a hash of IAuxSig or just a padding node hash
   */
  aux: string
}

export interface IAttestationNode extends IAttestationLegacy {
  link: IRevocationLinks
}

export interface IDataNodeLegacy {
  attestationNode: IAttestationNode
  signedAttestation: string // Root hash of Attestation tree signed by attester
}

export interface IIssuanceNode {
  /** Hex string to identify this attestation node in the event of partial revocation */
  localRevocationToken: string
  /** Hex string to identify this attestation in the event of revocation */
  globalRevocationToken: string
  /** hash of data node attester is verifying */
  dataHash: string
  /** hash of type node attester is verifying */
  typeHash: string
  /** RFC3339 timestamp of when the claim was issued https://tools.ietf.org/html/rfc3339 */
  issuanceDate: string
  /** RFC3339 timestamp of when the claim should expire https://tools.ietf.org/html/rfc3339 */
  expirationDate: string
}

export interface IAuxSig {
  /** Hex string containing subject's auxiliary signature. Signs the ordered stringified object containing { dataHash: hashAttestation(IAttestationData), typeHash: hashAttestation(IAttestationType)} */
  signedHash: string
  /** Nonce to conceal unwanted revealing of aux public key */
  nonce: string
}

export interface IClaimNode {
  data: IAttestationData
  type: IAttestationType
  /** aux either contains a hash of IAuxSig or just a padding node hash */
  aux: string
}

export interface IIssuedClaimNode extends IClaimNode {
  issuance: IIssuanceNode
}

export interface ISignedClaimNode {
  claimNode: IIssuedClaimNode
  attester: string
  attesterSig: string // Root hash of claim tree signed by attester
}
