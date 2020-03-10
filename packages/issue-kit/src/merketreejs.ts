// MIT license
//
// Copyright (C) 2015 Miguel Mota
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
// of the Software, and to permit persons to whom the Software is furnished to do
// so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import {IProof} from '@bloomprotocol/vc-common'
import CryptoJS from 'crypto-js'

export class MerkleTree {
  hashAlgo: (x: any) => Buffer
  leaves: Buffer[]
  layers: Buffer[][]

  /**
   * @desc Constructs a Merkle Tree.
   * All nodes and leaves are stored as Buffers.
   * Lonely leaf nodes are promoted to the next level up without being hashed again.
   * @param {Buffer[]} leaves - Array of hashed leaves. Each leaf must be a Buffer.
   * @param {Function} hashAlgorithm - Algorithm used for hashing leaves and nodes
   */
  constructor(leaves: Buffer[], hashAlgorithm: (input: Buffer) => Buffer) {
    this.hashAlgo = bufferify(hashAlgorithm)
    this.leaves = leaves
    this.layers = [leaves]

    this.createHashes(this.leaves)
  }

  createHashes(nodes: Buffer[]) {
    while (nodes.length !== 1) {
      const layerIndex = this.layers.length

      this.layers.push([])

      for (let i = 0; i < nodes.length - 1; i += 2) {
        const left = nodes[i]
        const right = nodes[i + 1]
        const data = Buffer.concat([left, right])
        const hash = this.hashAlgo(data)
        this.layers[layerIndex].push(hash)
      }

      // is odd number of nodes
      if (nodes.length % 2 === 1) {
        const data = nodes[nodes.length - 1]
        const hash = data

        this.layers[layerIndex].push(hash)
      }

      nodes = this.layers[layerIndex]
    }
  }

  /**
   * getLeaves
   * @desc Returns array of leaves of Merkle Tree.
   * @return {Buffer[]}
   * @example
   * const leaves = tree.getLeaves()
   */
  getLeaves() {
    return this.leaves
  }

  /**
   * getLayers
   * @desc Returns array of all layers of Merkle Tree, including leaves and root.
   * @return {Buffer[]}
   * @example
   * const layers = tree.getLayers()
   */
  getLayers() {
    return this.layers
  }

  /**
   * getRoot
   * @desc Returns the Merkle root hash as a Buffer.
   * @return {Buffer}
   * @example
   * const root = tree.getRoot()
   */
  getRoot() {
    return this.layers[this.layers.length - 1][0]
  }

  /**
   * getProof
   * @desc Returns the proof for a target leaf.
   * @param {Buffer} leaf - Target leaf
   * @param {Number} [index] - Target leaf index in leaves array.
   * Use if there are leaves containing duplicate data in order to distinguish it.
   * @return {Object[]} - Array of objects containing a position property of type string
   * with values of 'left' or 'right' and a data property of type Buffer.
   * @example
   * const proof = tree.getProof(leaves[2])
   *
   * @example
   * const leaves = ['a', 'b', 'a'].map(x => sha3(x))
   * const tree = new MerkleTree(leaves, sha3)
   * const proof = tree.getProof(leaves[2], 2)
   */
  getProof(leaf: Buffer, index?: number) {
    const proof: IProof[] = []

    if (typeof index !== 'number') {
      index = -1

      for (let i = 0; i < this.leaves.length; i++) {
        if (Buffer.compare(leaf, this.leaves[i]) === 0) {
          index = i
        }
      }
    }

    if (index <= -1) {
      return []
    }

    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i]
      const isRightNode = index % 2
      const pairIndex = isRightNode ? index - 1 : index + 1

      if (pairIndex < layer.length) {
        proof.push({
          position: isRightNode ? 'left' : 'right',
          data: layer[pairIndex],
        })
      }

      // set index to parent index
      index = (index / 2) | 0
    }

    return proof
  }

  /**
   * verify
   * @desc Returns true if the proof path (array of hashes) can connect the target node
   * to the Merkle root.
   * @param {Object[]} proof - Array of proof objects that should connect
   * target node to Merkle root.
   * @param {Buffer} targetNode - Target node Buffer
   * @param {Buffer} root - Merkle root Buffer
   * @return {Boolean}
   * @example
   * const root = tree.getRoot()
   * const proof = tree.getProof(leaves[2])
   * const verified = tree.verify(proof, leaves[2], root)
   *
   */
  verify(proof: IProof[], targetNode: Buffer, root: Buffer) {
    let hash = targetNode

    if (!Array.isArray(proof) || !proof.length || !targetNode || !root) {
      return false
    }

    for (let i = 0; i < proof.length; i++) {
      const node = proof[i]
      const isLeftNode = node.position === 'left'
      const buffers = []
      buffers.push(hash)
      buffers[isLeftNode ? 'unshift' : 'push'](node.data)

      hash = this.hashAlgo(Buffer.concat(buffers))
    }

    return Buffer.compare(hash, root) === 0
  }
}

const bufferify = (f: (input: any) => any) => {
  return (x: any) => {
    const v = f(x)
    if (Buffer.isBuffer(v)) {
      return v
    }

    // crypto-js support
    return Buffer.from(f(CryptoJS.enc.Hex.parse(x.toString('hex'))).toString(CryptoJS.enc.Hex), 'hex')
  }
}
