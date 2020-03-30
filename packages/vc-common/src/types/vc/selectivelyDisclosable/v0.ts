import {ISignedClaimNode, IDataNodeLegacy} from '../base/v0'

export interface IBloomMerkleTreeComponentsLegacy {
  layer2Hash: string // Hash merkle root and nonce
  signedRootHash: string
  rootHashNonce: string
  rootHash: string // The root the Merkle tree
  dataNodes: IDataNodeLegacy[]
  checksumSig: string // Attester signature of ordered array of dataNode hashes
  paddingNodes: string[]
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
