import {EthUtils, IFormattedTypedData} from '@bloomprotocol/attestations-common'
import * as ethUtil from 'ethereumjs-util'
import {keccak256} from 'js-sha3'
import * as ethSigUtil from 'eth-sig-util'
import randomBytes from 'randombytes'

import {MerkleTree} from './merketreejs'

export const getMerkleTreeFromLeaves = (leaves: string[]) => {
  const leavesSorted = leaves.sort().map(hexStr => ethUtil.toBuffer(hexStr))
  return new MerkleTree(leavesSorted, x => Buffer.from(keccak256(x), 'hex'))
}

/**
 * Given an array of hashed dataNode signatures and a hashed checksum signature, creates a new MerkleTree
 * after padding, and sorting.
 *
 */
export const getBloomMerkleTree = (claimHashes: string[], paddingNodes: string[], checksumHash: string): MerkleTree => {
  let leaves = claimHashes
  leaves.push(checksumHash)
  leaves = leaves.concat(paddingNodes)
  return getMerkleTreeFromLeaves(leaves)
}

export const getAttestationAgreement = (
  contractAddress: string,
  chainId: number,
  dataHash: string,
  requestNonce: string,
): IFormattedTypedData => {
  return {
    types: {
      EIP712Domain: [
        {name: 'name', type: 'string'},
        {name: 'version', type: 'string'},
        {name: 'chainId', type: 'uint256'},
        {name: 'verifyingContract', type: 'address'},
      ],
      AttestationRequest: [
        {name: 'dataHash', type: 'bytes32'},
        {name: 'nonce', type: 'bytes32'},
      ],
    },
    primaryType: 'AttestationRequest',
    domain: {
      name: 'Bloom Attestation Logic',
      version: '2',
      chainId: chainId,
      verifyingContract: contractAddress,
    },
    message: {
      dataHash: dataHash,
      nonce: requestNonce,
    },
  }
}

export const validateSignedAgreement = (subjectSig: string, contractAddress: string, dataHash: string, nonce: string, subject: string) => {
  const recoveredEthAddress = ethSigUtil.recoverTypedSignature({
    data: getAttestationAgreement(contractAddress, 1, dataHash, nonce),
    sig: subjectSig,
  })
  return recoveredEthAddress.toLowerCase() === subject.toLowerCase()
}

/**
 * Given the number of data nodes return an array of padding nodes
 * @param {number} dataCount - number of data nodes in tree
 *
 * A Bloom Merkle tree will contain at minimum one data node and one checksum node
 * In order to obscure the amount of data in the tree, the number of nodes are padded to
 * a set threshold
 *
 * The Depth of the tree increments in steps of 5
 * The number of terminal nodes in a filled binary tree is 2 ^ (n - 1) where n is the depth
 *
 * dataCount 1 -> 15: paddingCount: 14 -> 0 (remeber + 1 for checksum node)
 * dataCount 16 -> 511: paddingCount 495 -> 0
 * dataCount 512 -> ...: paddingCount 15871 -> ...
 * ...
 */
export const getPadding = (dataCount: number): string[] => {
  if (dataCount < 1) return []
  let i = 5
  while (dataCount + 1 > 2 ** (i - 1)) {
    i += 5
  }
  const paddingCount = 2 ** (i - 1) - (dataCount + 1)

  return Array(paddingCount)
    .fill('')
    .map(() => EthUtils.hashMessage(randomBytes(20).toString()))
}
