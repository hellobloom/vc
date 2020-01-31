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

export type FullVCVerifiedDataLegacyV1 = {
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
  target: VCLegacySignedDataNodeV1

  /**
   * Ethereum address of the attester that performed the attestation
   */
  attester: string
}

export type FullVCVerifiedDataOnChainV1 = {
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
  target: VCSignedClaimNodeV1

  /**
   * Ethereum address of the attester that performed the attestation
   */
  attester: string
}

export type FullVCVerifiedDataBatchV1 = {
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
  target: VCSignedClaimNodeV1

  /**
   * Ethereum address of the attester that performed the attestation
   */
  attester: string

  /**
   * Subject of atteststation
   */
  subject: string
}

export type FullVCVerifiedDataV1 = FullVCVerifiedDataLegacyV1 | FullVCVerifiedDataOnChainV1 | FullVCVerifiedDataBatchV1

export type FullVCTypeV1 = [BaseVCTypeV1[0], 'FullCredential', ...string[]]

export type FullVCSubjectV1 = BaseVCSubjectV1 & {
  data: string
  /**
   * Array of signed authorization objects
   * Only included if subject is different from sharer
   * otherwise empty array
   */
  authorization: FullVCSignedAuthorizationV1[]
}

export type FullVCProofV1 = {
  type: string
  created: string
  proofPurpose: 'assertionMethod'
  verificationMethod: string
  jws: string
  data: FullVCVerifiedDataV1
}

export type FullVCV1<
  Subject extends FullVCSubjectV1 = FullVCSubjectV1,
  Type extends FullVCTypeV1 = FullVCTypeV1,
  Proof extends FullVCProofV1 = FullVCProofV1
> = BaseVCV1<Type, Subject, Proof>
