import {TAttestationTypeNames} from '../../attestation'
import {Stage, IMerkleProofShare} from '../../misc'
import {ISignedClaimNode, IDataNodeLegacy} from '../shared/v0'

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

export enum DataVersions {
  legacy = 'legacy',
  onChain = 'onChain',
  batch = 'batch',
  batchProof = 'batchProof',
}

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
