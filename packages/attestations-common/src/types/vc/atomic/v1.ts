import {Stage, IMerkleProofShare} from '../../misc'
import {BaseVCV1, BaseVCTypeV1, BaseVCSubjectV1, VCSignedClaimNodeV1} from '../shared/v1'
import {VCLegacySignedDataNodeV1} from '../shared/v1'

export type AtomicVCAuthorizationV1 = {
  /** Address of keypair granting authorization */
  subject: string
  /** Address of keypair receiving authorization */
  recipient: string
  /** Hex string to identify this authorization in the event of revocation */
  revocation: string
}

export type AtomicVCSignedAuthorizationV1 = {
  /** Hash of IAuthorization */
  authorization: AtomicVCAuthorizationV1
  /** Signed hashed authorization */
  signature: string
}

export type AtomicVCVerifiedDataLegacyV1 = {
  version: 'legacy'
  /** Blockchain transaction hash which emits the layer2Hash property */
  tx: string
  /** Attestation hash that lives on chain and is formed by hashing the merkle tree root hash with a nonce.  */
  layer2Hash: string
  /** Merkle tree root hash */
  rootHash: string
  /** Nonce used to hash the `rootHash` to create the `layer2Hash` */
  rootHashNonce: string
  /** Merkle tree leaf proof */
  proof: IMerkleProofShare[]
  /** The Ethereum network name on which the tx can be found */
  stage: Stage
  /** Data node containing the raw verified data that was requested */
  target: VCLegacySignedDataNodeV1
  /** Ethereum address of the attester that performed the attestation */
  attester: string
}

export type AtomicVCVerifiedDataOnChainV1 = {
  version: 'onChain'
  /** Blockchain transaction hash which emits the layer2Hash property */
  tx: string
  /** Attestation hash that lives on chain and is formed by hashing the merkle tree root hash with a nonce.  */
  layer2Hash: string
  /** Merkle tree root hash */
  rootHash: string
  /** Nonce used to hash the `rootHash` to create the `layer2Hash` */
  rootHashNonce: string
  /** Merkle tree leaf proof */
  proof: IMerkleProofShare[]
  /** The Ethereum network name on which the tx can be found */
  stage: Stage
  /** Data node containing the raw verified data that was requested */
  target: VCSignedClaimNodeV1
  /** Ethereum address of the attester that performed the attestation */
  attester: string
}

export type AtomicVCVerifiedDataBatchV1 = {
  version: 'batch'
  /** Attestation hash formed by hashing subject sig with attester sig */
  batchLayer2Hash: string
  /** Attester signature of layer2Hash and subject address */
  batchAttesterSig: string
  /** Subject signature of attestation agreement */
  subjectSig: string
  /** Nonce used in subject sig */
  requestNonce: string
  /** Hash of rootHash and rootHashNonce */
  layer2Hash: string
  /** Merkle tree root hash */
  rootHash: string
  /** Nonce used to hash the `rootHash` to create the `layer2Hash` */
  rootHashNonce: string
  /** Merkle tree leaf proof */
  proof: IMerkleProofShare[]
  /** The Ethereum network name on which the tx can be found */
  stage: Stage
  /** Data node containing the raw verified data that was requested */
  target: VCSignedClaimNodeV1
  /** Ethereum address of the attester that performed the attestation */
  attester: string
  /** Subject of atteststation */
  subject: string
}

export type AtomicVCVerifiedDataV1 = AtomicVCVerifiedDataLegacyV1 | AtomicVCVerifiedDataOnChainV1 | AtomicVCVerifiedDataBatchV1

export type AtomicVCTypeV1 = [BaseVCTypeV1[0], 'AtomicCredential', ...string[]]

export type AtomicVCSubjectV1 = BaseVCSubjectV1

export type AtomicVCProofV1 = {
  type: string
  created: string
  proofPurpose: 'assertionMethod'
  verificationMethod: string
  jws: string
}

export type AtomicVCV1<
  Subject extends AtomicVCSubjectV1 = AtomicVCSubjectV1,
  Type extends AtomicVCTypeV1 = AtomicVCTypeV1,
  Proof extends AtomicVCProofV1 = AtomicVCProofV1
> = BaseVCV1<Subject, Type, Proof>
