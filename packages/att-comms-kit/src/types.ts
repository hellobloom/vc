import {TAttestationTypeNames, AttestationTypeID} from './AttestationTypes'

/**
 * Latest supported types for constructing and interpreting Bloom Merkle Tree
 */
export interface IAttestationData {
  // tslint:disable:max-line-length
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
  // tslint:enable:max-line-length
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

export interface IAttestationType {
  /**
   * The type of attestation (phone, email, etc.)
   */
  type: keyof typeof AttestationTypeID
  /**
   * Optionally identifies service used to perform attestation
   */
  provider?: string
  /**
   * Attestation type nonce
   */
  nonce: string
}

export interface IIssuanceNode {
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

export interface IAuxSig {
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

export interface IClaimNode {
  data: IAttestationData
  type: IAttestationType
  /**
   * aux either contains a hash of IAuxSig or just a padding node hash
   */
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

export interface IBloomMerkleTreeComponents {
  attester: string
  attesterSig: string
  checksumSig: string // Attester signature of ordered array of dataNode hashes
  claimNodes: ISignedClaimNode[]
  layer2Hash: string // Hash of merkle root and nonce
  paddingNodes: string[]
  rootHash: string // The root the Merkle tree
  rootHashNonce: string
  version: string
}

export interface IBloomBatchMerkleTreeComponents extends IBloomMerkleTreeComponents {
  batchAttesterSig: string
  batchLayer2Hash: string // Hash of attester sig and subject sig
  contractAddress: string
  requestNonce: string
  subject: string
  subjectSig: string
}

export interface IAuthorization {
  /**
   * Address of keypair granting authorization
   */
  subject: string
  /**
   * Address of keypair receiving authorization
   */
  recipient: string
  /**
   * Hex string to identify this authorization in the event of revocation
   */
  revocation: string
}

export interface ISignedAuthorization {
  /**
   * Hash of IAuthorization
   */
  authorization: IAuthorization
  /**
   * Signed hashed authorization
   */
  signature: string
}

/**
 * Legacy types for constructing and interpreting Bloom Merkle Tree
 */
export interface IRevocationLinks {
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

export interface IAttestationLegacy {
  data: IAttestationData
  type: IAttestationType
  /**
   * aux either contains a hash of IAuxSig or just a padding node hash
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

export interface IBloomMerkleTreeComponentsLegacy {
  layer2Hash: string // Hash merkle root and nonce
  signedRootHash: string
  rootHashNonce: string
  rootHash: string // The root the Merkle tree
  dataNodes: IDataNodeLegacy[]
  checksumSig: string // Attester signature of ordered array of dataNode hashes
  paddingNodes: string[]
}

export enum ChainId {
  Main = 1,
  Rinkeby = 4,
}

export interface ITypedDataParam {
  name: string
  type: string
}

export interface IFormattedTypedData {
  types: {
    EIP712Domain: ITypedDataParam[]
    [key: string]: ITypedDataParam[]
  }
  primaryType: string
  domain: {
    name: string
    version: string
    chainId: number
    verifyingContract: string
  }
  message: {[key: string]: string}
}

export interface IMerkleProofShare {
  position: 'left' | 'right'
  data: string
}

export interface IProof {
  position: 'left' | 'right'
  data: Buffer
}

export type Stage = 'mainnet' | 'rinkeby' | 'ropsten' | 'local'

export enum DataVersions {
  legacy = 'legacy',
  onChain = 'onChain',
  batch = 'batch',
  batchProof = 'batchProof',
}

/**
 * Represents the data shared by a user, which has been attested on the Bloom Protocol.
 * Receivers of this data can / should verity this data hasn't been tampered with.
 */
export interface IVerifiedDataLegacy {
  version: DataVersions.legacy

  /**
   * Blockchain transaction hash which emits the layer2Hash property
   */
  tx: string

  /**
   * Attestation hash that lives on chain and is formed by hashing the merkle
   * tree root hash with a nonce.
   */
  layer2Hash: string

  /**
   * Merkle tree root hash
   */
  rootHash: string

  /**
   * Nonce used to hash the `rootHash` to create the `layer2Hash`
   */
  rootHashNonce: string

  /**
   * Merkle tree leaf proof
   */
  proof: IMerkleProofShare[]

  /**
   * The Ethereum network name on which the tx can be found
   */
  stage: Stage

  /**
   * Data node containing the raw verified data that was requested
   */
  target: IDataNodeLegacy

  /**
   * Ethereum address of the attester that performed the attestation
   */
  attester: string
}

export interface IVerifiedDataOnChain {
  version: DataVersions.onChain

  /**
   * Blockchain transaction hash which emits the layer2Hash property
   */
  tx: string

  /**
   * Attestation hash that lives on chain and is formed by hashing the merkle
   * tree root hash with a nonce.
   */
  layer2Hash: string

  /**
   * Merkle tree root hash
   */
  rootHash: string

  /**
   * Nonce used to hash the `rootHash` to create the `layer2Hash`
   */
  rootHashNonce: string

  /**
   * Merkle tree leaf proof
   */
  proof: IMerkleProofShare[]

  /**
   * The Ethereum network name on which the tx can be found
   */
  stage: Stage

  /**
   * Data node containing the raw verified data that was requested
   */
  target: ISignedClaimNode

  /**
   * Ethereum address of the attester that performed the attestation
   */
  attester: string
}

export interface IVerifiedDataBatch {
  version: DataVersions.batch

  /**
   * Attestation hash formed by hashing subject sig with attester sig
   */
  batchLayer2Hash: string

  /**
   * Attester signature of layer2Hash and subject address
   */
  batchAttesterSig: string

  /**
   * Subject signature of attestation agreement
   */
  subjectSig: string

  /**
   * Nonce used in subject sig
   */
  requestNonce: string

  /**
   * Hash of rootHash and rootHashNonce
   */
  layer2Hash: string

  /**
   * Merkle tree root hash
   */
  rootHash: string

  /**
   * Nonce used to hash the `rootHash` to create the `layer2Hash`
   */
  rootHashNonce: string

  /**
   * Merkle tree leaf proof
   */
  proof: IMerkleProofShare[]

  /**
   * The Ethereum network name on which the tx can be found
   */
  stage: Stage

  /**
   * Data node containing the raw verified data that was requested
   */
  target: ISignedClaimNode

  /**
   * Ethereum address of the attester that performed the attestation
   */
  attester: string

  /**
   * Subject of atteststation
   */
  subject: string
}

// Simple proof of batchLayer2Hash inclusion in a block
export interface IBatchProof {
  version: DataVersions.batchProof

  /**
   * Blockchain transaction hash which emits the batch root property
   */
  tx: string

  /**
   * Merkle tree leaf proof
   */
  proof: IMerkleProofShare[]

  /**
   * The Ethereum network name on which the tx can be found
   */
  stage: Stage

  /**
   * Root hash embedded in batch tree
   */
  target: string
}

export type VerifiedData = IVerifiedDataLegacy | IVerifiedDataOnChain | IVerifiedDataBatch

export interface ICredentialProof {
  // type string describing share kit style proof
  type: string
  // issuance date of the proof
  created: string

  // TODO link within issuer document
  // for now just attester address
  creator: string
  data: VerifiedData
}

export interface IVerifiableCredential {
  // TODO link to docs describing type strings
  id: string
  type: TAttestationTypeNames

  // TODO link to Bloom hosted json doc describing the attester key used to sign creds
  // for now just attester address
  issuer: string

  issuanceDate: string

  credentialSubject: {
    // original subject of attestation
    subject: string
    data: string
    /**
     * Array of signed authorization objects
     * Only included if subject is different from sharer
     * otherwise empty array
     */
    authorization: ISignedAuthorization[]
  }

  proof: ICredentialProof
}

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

export interface IAuthProof {
  // type string describing share kit style proof
  type: string
  // recent timestamp in RFC3339 format
  created: string
  // The Ethereum address of the user sharing their data
  creator: string
  // token challenge from recipient
  nonce: string
  // host of recipient endpoint
  domain: string
}

export interface IVerifiableAuth {
  // TODO context document
  context: string[]
  type: 'VerifiableAuth'
  proof: IAuthProof
  // Signature of keccak256'ed JSON
  signature: string
}
