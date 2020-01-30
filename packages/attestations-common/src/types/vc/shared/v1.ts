export type VCClaimNodeDataV1 = {
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
  /**
   * Attestation data nonce
   */
  nonce: string
  /**
   * Semantic version used to keep track of attestation versions
   */
  version: string
}

export type VCClaimNodeTypeV1 = {
  /**
   * The type of attestation (phone, email, etc.)
   */
  type: string
  /**
   * Optionally identifies service used to perform attestation
   */
  provider?: string
  /**
   * Attestation type nonce
   */
  nonce: string
}

export type VCClaimNodeAuxSigV1 = {
  /**
   * Hex string containing subject's auxiliary signature
   * Signs the ordered stringified object containing
   * { dataHash: hashAttestation(IAttestationData), typeHash: hashAttestation(IAttestationType)}
   */
  signedHash: string
  /**
   * Nonce to conceal unwanted revealing of aux public key
   */
  nonce: string
}

export type VCClaimNodeV1 = {
  data: VCClaimNodeDataV1
  type: VCClaimNodeTypeV1
  /**
   * aux either contains a hash of VCClaimNodeAuxSigV1 or just a padding node hash
   */
  aux: string
}

export type VCRevocationLinks = {
  /**
   * Hex string to identify this attestation node in the event of partial revocation
   */
  local: string
  /**
   * Hex string to identify this attestation in the event of revocation
   */
  global: string
  /**
   * hash of data node attester is verifying
   */
  dataHash: string
  /**
   * hash of type node attester is verifying
   */
  typeHash: string
}

export type VCLegacyAttestationNode = VCClaimNodeV1 & {
  link: VCRevocationLinks
}

export type VCLegacySignedDataNodeV1 = {
  attestationNode: VCLegacyAttestationNode
  signedAttestation: string // Root hash of Attestation tree signed by attester
}

type VCIssuanceNodeV1 = {
  /**
   * Hex string to identify this attestation node in the event of partial revocation
   */
  localRevocationToken: string
  /**
   * Hex string to identify this attestation in the event of revocation
   */
  globalRevocationToken: string
  /**
   * hash of data node attester is verifying
   */
  dataHash: string
  /**
   * hash of type node attester is verifying
   */
  typeHash: string
  /**
   * RFC3339 timestamp of when the claim was issued
   * https://tools.ietf.org/html/rfc3339
   */
  issuanceDate: string
  /**
   * RFC3339 timestamp of when the claim should expire
   * https://tools.ietf.org/html/rfc3339
   */
  expirationDate: string
}

export type VCIssuedClaimNodeV1 = VCClaimNodeV1 & {
  issuance: VCIssuanceNodeV1
}

export type VCSignedClaimNodeV1 = {
  claimNode: VCIssuedClaimNodeV1
  issuer: string
  issuerSignature: string
}

export type BaseVCTypeV1 = ['VerifiableCredential', ...string[]]

export type BaseVCSubjectV1 = {
  id: string
}

export type BaseVCV1<Type extends BaseVCTypeV1 = BaseVCTypeV1, Subject extends BaseVCSubjectV1 = BaseVCSubjectV1, Proof extends {} = {}> = {
  '@context': string[]
  id: 'placeholder'
  type: Type
  issuer: string
  issuanceDate: string
  expirationDate?: string
  credentialSubject: Subject
  proof: Proof
}
