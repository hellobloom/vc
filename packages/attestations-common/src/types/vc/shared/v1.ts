export type TContext = string | string[] | {} | Array<{}>
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
  /** Attestation data nonce */
  nonce: string
  /** Semantic version used to keep track of attestation versions */
  version: string
}

export type VCClaimNodeTypeV1 = {
  /** The type of attestation (phone, email, etc.) */
  type: string
  /** Optionally identifies service used to perform attestation */
  provider?: string
  /** Attestation type nonce */
  nonce: string
}

export type VCClaimNodeAuxSigV1 = {
  /** Hex string containing subject's auxiliary signature.  Signs the ordered stringified object containing { dataHash: hashAttestation(IAttestationData), typeHash: hashAttestation(IAttestationType)} */
  signedHash: string
  /** Nonce to conceal unwanted revealing of aux public key */
  nonce: string
}

export type VCClaimNodeV1 = {
  data: VCClaimNodeDataV1
  type: VCClaimNodeTypeV1
  /** aux either contains a hash of VCClaimNodeAuxSigV1 or just a padding node hash */
  aux: string
}

export type VCRevocationLinks = {
  /** Hex string to identify this attestation node in the event of partial revocation */
  local: string
  /** Hex string to identify this attestation in the event of revocation */
  global: string
  /** hash of data node attester is verifying */
  dataHash: string
  /** hash of type node attester is verifying */
  typeHash: string
}

export type BaseVCTypeV1 = ['VerifiableCredential', ...string[]]

export type BaseVCSubjectV1<Data extends {} = {}> = Data & {
  id: string
}

export type BaseVCProofV1 = {
  type: string
  created: string
  proofPurpose: 'assertionMethod'
  verificationMethod: string
  jws: string
}

export type BaseVCRevocationV1 = {
  '@context': string
}

export type BaseVCRevocationSimpleV1 = {
  '@context': string
  token: string
}

export type BaseVCV1<
  Subject extends BaseVCSubjectV1 = BaseVCSubjectV1,
  Type extends BaseVCTypeV1 = BaseVCTypeV1,
  Proof extends BaseVCProofV1 = BaseVCProofV1,
  Revocation extends BaseVCRevocationV1 = BaseVCRevocationV1
> = {
  '@context': TContext
  id?: string
  type: Type
  issuer: string
  issuanceDate: string
  expirationDate?: string
  credentialSubject: Subject | Subject[]
  revocation: Revocation
  proof: Proof
}

export type VPTypeV1 = ['VerifiablePresentation', ...string[]]

export type VPProofV1 = {
  type: string
  created: string
  proofPurpose: 'authentication'
  verificationMethod: string
  challenge: string
  domain: string
  jws: string
}

// TODO: This is missing the `signature` and `packedData` fields. How should those translate over?
export type VPV1<VC extends BaseVCV1 = BaseVCV1> = {
  '@context': TContext
  type: VPTypeV1
  verifiableCredential: VC[]
  holder: string
  proof: VPProofV1
}

export type VP = VPV1
