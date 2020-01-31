import {Stage, IMerkleProofShare} from '../../misc'
import {BaseVCV1, BaseVCTypeV1, BaseVCSubjectV1, VCSignedClaimNodeV1} from '../shared/v1'
import {VCLegacySignedDataNodeV1} from '../shared/v1'

export type FullVCAuthorizationV1 = {
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

export type FullVCSignedAuthorizationV1 = {
  /**
   * Hash of IAuthorization
   */
  authorization: FullVCAuthorizationV1
  /**
   * Signed hashed authorization
   */
  signature: string
}

export type FullVCVerifiedDataLegacyV1<D extends {} = {}> = {
  version: 'legacy'

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
  target: VCLegacySignedDataNodeV1<D>

  /**
   * Ethereum address of the attester that performed the attestation
   */
  attester: string
}

export type FullVCVerifiedDataOnChainV1<D extends {} = {}> = {
  version: 'onChain'

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
  target: VCSignedClaimNodeV1<D>

  /**
   * Ethereum address of the attester that performed the attestation
   */
  attester: string
}

export type FullVCVerifiedDataBatchV1<D extends {} = {}> = {
  version: 'batch'
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
  target: VCSignedClaimNodeV1<D>

  /**
   * Ethereum address of the attester that performed the attestation
   */
  attester: string

  /**
   * Subject of atteststation
   */
  subject: string
}

export type FullVCVerifiedDataV1<D extends {} = {}> =
  | FullVCVerifiedDataLegacyV1<D>
  | FullVCVerifiedDataOnChainV1<D>
  | FullVCVerifiedDataBatchV1<D>

export type FullVCTypeV1<T extends string> = [BaseVCTypeV1[0], 'FullCredential', T]

export type FullVCSubjectV1<T = {}> = T &
  BaseVCSubjectV1 & {
    /**
     * Array of signed authorization objects
     * Only included if subject is different from sharer
     * otherwise empty array
     */
    authorization: FullVCSignedAuthorizationV1[]
  }

export type FullVCProofV1<D extends {} = {}> = {
  type: string
  created: string
  proofPurpose: 'assertionMethod'
  verificationMethod: string
  jws: string
  data: FullVCVerifiedDataV1<D>
}

export type FullVCV1<T extends string = string, D extends FullVCSubjectV1 = FullVCSubjectV1> = BaseVCV1<
  FullVCTypeV1<T>,
  FullVCSubjectV1<D>,
  FullVCProofV1<D>
>

// To make specific types of full VCs pass data through the generics
// type AlumniVCV1 = FullVCV1<'AlumniCredential', {alumniOf: string}>
// Not sure if the last two generics should be condensed to one or not
