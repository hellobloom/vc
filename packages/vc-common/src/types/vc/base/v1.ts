type ContextObjDetailedItem = {
  [key: string]: undefined | string
  '@id': string
  '@type': string
}

type ContextObj = {
  [key: string]: undefined | number | string | ContextObjDetailedItem
  '@version'?: number
  '@base'?: string
  '@vocab'?: string
}

export type TContext = string | string[] | ContextObj | ContextObj[]

export type BaseVCV1ClaimNodeData = {
  /**
   * String representation of the attestations data.
   *
   * ### Examples ###
   * email: "test@bloom.co"
   * sanction-screen: {\"firstName\":\"FIRSTNAME\",\"middleName\":\"MIDDLENAME\",\"lastName\":\"LASTNAME\",\"birthMonth\":1,\"birthDay\":1,\"birthYear\":1900,\"id\":\"a1a1a1a...\"}
   *
   * Any attestation that isn't a single string value will be
   * a JSON string representing the attestation data.
   */
  data: string
  /** Attestation data nonce */
  nonce: string
  /** Semantic version used to keep track of attestation versions */
  version: string
}

export type BaseVCV1ClaimNodeType = {
  /** The type of attestation (phone, email, etc.) */
  type: string
  /** Optionally identifies service used to perform attestation */
  provider?: string
  /** Attestation type nonce */
  nonce: string
}

export type BaseVCV1ClaimNodeAuxSig = {
  /** Hex string containing subject's auxiliary signature.  Signs the ordered stringified object containing { dataHash: hashAttestation(IAttestationData), typeHash: hashAttestation(IAttestationType)} */
  signedHash: string
  /** Nonce to conceal unwanted revealing of aux public key */
  nonce: string
}

export type BaseVCV1ClaimNode = {
  data: BaseVCV1ClaimNodeData
  type: BaseVCV1ClaimNodeType
  /** aux either contains a hash of BaseVCV1ClaimNodeAuxSig or just a padding node hash */
  aux: string
}

export type BaseVCV1RevocationLinks = {
  /** Hex string to identify this attestation node in the event of partial revocation */
  local: string
  /** Hex string to identify this attestation in the event of revocation */
  global: string
  /** hash of data node attester is verifying */
  dataHash: string
  /** hash of type node attester is verifying */
  typeHash: string
}

// Do not import {Thing} from 'schema-dts' because it chokes TS
export type SimpleThing = {'@type': string}

export type BaseVCV1Type = ['VerifiableCredential', ...string[]]

export type BaseVCV1Subject<Data extends SimpleThing> = {
  id: string
  data: Data
}

export type BaseVCV1Proof = {
  type: string
  created: string
  proofPurpose: 'assertionMethod'
  verificationMethod: string
  jws: string
}

export type BaseVCV1Revocation = {
  // id: 'urn:uuid:...' etc.
  id: string
}

export type BaseVCV1<
  Subject extends BaseVCV1Subject<SimpleThing> = BaseVCV1Subject<SimpleThing>,
  Type extends BaseVCV1Type = BaseVCV1Type,
  Proof extends BaseVCV1Proof = BaseVCV1Proof,
  Revocation extends BaseVCV1Revocation = BaseVCV1Revocation
> = {
  '@context': TContext
  id: string
  type: Type
  issuer: string
  issuanceDate: string
  expirationDate?: string
  credentialSubject: Subject | Subject[]
  revocation: Revocation
  proof: Proof
}

export type BaseVPV1Type = ['VerifiablePresentation', ...string[]]

export type BaseVPV1Proof = {
  type: string
  created: string
  proofPurpose: 'authentication'
  verificationMethod: string
  challenge: string
  domain: string
  jws: string
}

// TODO: This is missing the `signature` and `packedData` fields. How should those translate over?
export type BaseVPV1<VC extends BaseVCV1 = BaseVCV1> = {
  '@context': TContext
  type: BaseVPV1Type
  verifiableCredential: VC[]
  holder: string
  proof: BaseVPV1Proof
}

export type BaseVP = BaseVPV1
