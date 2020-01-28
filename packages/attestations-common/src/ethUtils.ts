import {keccak256} from 'js-sha3'
import * as ethUtil from 'ethereumjs-util'
import randomBytes from 'randombytes'
import * as ethSigUtil from 'eth-sig-util'
import EthWallet from 'ethereumjs-wallet'
import {
  IDidResolver,
  IDidResolveResult,
  DidDocument,
  IDidDocument,
  IDidDocumentPublicKey,
} from '@decentralized-identity/did-common-typescript'

import {MerkleTree} from './merkletreejs'
import {
  IIssuedClaimNode,
  ISignedClaimNode,
  IAttestationNode,
  IAttestationLegacy,
  IClaimNode,
  IBloomMerkleTreeComponentsLegacy,
  IBloomMerkleTreeComponents,
  IBloomBatchMerkleTreeComponents,
  IDataNodeLegacy,
  IFormattedTypedData,
  IProof,
  AttestationTypeID,
} from './types'
import {orderedStringify, isNotEmptyString} from './utils'
import {validateDateTime} from './RFC3339DateTime'
import {genValidateFn} from './validation'

export const hashMessage = (message: string): string => ethUtil.addHexPrefix(keccak256(message))

/**
 * Generate a random hex string with 0x prefix
 */
export const generateNonce = () => hashMessage(randomBytes(20).toString())

export const getMerkleTreeFromLeaves = (leaves: string[]) => {
  const leavesSorted = leaves.sort().map(hexStr => ethUtil.toBuffer(hexStr))
  return new MerkleTree(leavesSorted, x => Buffer.from(keccak256(x), 'hex'))
}

/**
 *
 * @param attestation Given the contents of an attestation node, return a
 * Merkle tree
 */
export const getClaimTree = (claim: IIssuedClaimNode): MerkleTree => {
  const dataHash = hashMessage(orderedStringify(claim.data))
  const typeHash = hashMessage(orderedStringify(claim.type))
  const issuanceHash = hashMessage(orderedStringify(claim.issuance))
  const auxHash = hashMessage(claim.aux)
  return getMerkleTreeFromLeaves([dataHash, typeHash, issuanceHash, auxHash])
}

/**
 * Given the contents of an attestation node, return the root hash of the Merkle tree
 */
export const hashClaimTree = (claim: IIssuedClaimNode): Buffer => {
  const dataTree = getClaimTree(claim)
  return dataTree.getRoot()
}

/**
 * Sign a buffer with a given private key and return a hex string of the signature
 * @param hash Any message buffer
 * @param privKey A private key buffer
 */
export const signHash = (hash: Buffer, privKey: Buffer): string => {
  const sig = ethUtil.ecsign(hash, privKey)
  return ethSigUtil.concatSig(sig.v, sig.r, sig.s)
}

/**
 * Recover the address of the signer of a given message hash
 * @param hash Buffer of the message that was signed
 * @param sig Hex string of the signature
 */
export const recoverHashSigner = (hash: Buffer, signature: string) => {
  const sigParams = ethUtil.fromRpcSig(signature)
  const pubKey = ethUtil.ecrecover(hash, sigParams.v, sigParams.r, sigParams.s)
  const sender = ethUtil.publicToAddress(ethUtil.toBuffer(pubKey))
  return ethUtil.bufferToHex(sender)
}
/**
 * Sign a complete attestation node and return an object containing the datanode and the signature
 * @param dataNode - Complete attestation data node
 * @param globalRevocationLink - Hex string referencing revocation of the whole attestation
 * @param privKey - Private key of signer
 */
export const getSignedClaimNode = (
  claimNode: IClaimNode,
  globalRevocationLink: string,
  privKey: Buffer,
  issuanceDate: string,
  expirationDate: string,
  localRevocationLink?: string,
): ISignedClaimNode => {
  // validateDates
  if (!validateDateTime(issuanceDate)) throw new Error('Invalid issuance date')
  if (!validateDateTime(expirationDate)) {
    throw new Error('Invalid expiration date')
  }
  const issuedClaimNode: IIssuedClaimNode = {
    data: claimNode.data,
    type: claimNode.type,
    aux: claimNode.aux,
    issuance: {
      localRevocationToken: localRevocationLink || generateNonce(),
      globalRevocationToken: globalRevocationLink,
      dataHash: hashMessage(orderedStringify(claimNode.data)),
      typeHash: hashMessage(orderedStringify(claimNode.type)),
      issuanceDate: issuanceDate,
      expirationDate: expirationDate,
    },
  }
  const claimHash = hashClaimTree(issuedClaimNode)
  const attesterSig = signHash(claimHash, privKey)
  const attester = EthWallet.fromPrivateKey(privKey)
  return {
    claimNode: issuedClaimNode,
    attester: attester.getAddressString(),
    attesterSig: attesterSig,
  }
}

/**
 *
 * @param attestation Given the contents of an attestation node, return a
 * Merkle tree
 */
export const getDataTree = (attestation: IAttestationNode): MerkleTree => {
  const dataHash = hashMessage(orderedStringify(attestation.data))
  const typeHash = hashMessage(orderedStringify(attestation.type))
  const linkHash = hashMessage(orderedStringify(attestation.link))
  const auxHash = hashMessage(attestation.aux)
  return getMerkleTreeFromLeaves([dataHash, typeHash, linkHash, auxHash])
}

/**
 * Given the contents of an attestation node, return the root hash of the Merkle tree
 */
export const hashAttestationNode = (attestation: IAttestationNode): Buffer => {
  const dataTree = getDataTree(attestation)
  return dataTree.getRoot()
}

/**
 * Sign a complete attestation node and return an object containing the datanode and the signature
 * @param dataNode - Complete attestation data node
 * @param globalRevocationLink - Hex string referencing revocation of the whole attestation
 * @param privKey - Private key of signer
 */
export const getSignedDataNode = (dataNode: IAttestationLegacy, globalRevocationLink: string, privKey: Buffer): IDataNodeLegacy => {
  const attestationNode: IAttestationNode = {
    data: dataNode.data,
    type: dataNode.type,
    aux: dataNode.aux,
    link: {
      local: generateNonce(),
      global: globalRevocationLink,
      dataHash: hashMessage(orderedStringify(dataNode.data)),
      typeHash: hashMessage(orderedStringify(dataNode.type)),
    },
  }
  const attestationHash = hashAttestationNode(attestationNode)
  const attestationSig = signHash(attestationHash, privKey)
  return {
    attestationNode: attestationNode,
    signedAttestation: attestationSig,
  }
}

/**
 *
 * Methods supporting both current and legacy data structures
 */

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

/**
 * Given an array of root hashes, sort and hash them into a checksum buffer
 * @param {string[]} dataHashes - array of dataHashes as hex strings
 */
export const getChecksum = (dataHashes: string[]): Buffer => {
  return ethUtil.toBuffer(hashMessage(JSON.stringify(dataHashes.sort())))
}

/**
 * Given an array of root hashes, get and sign the checksum
 * @param dataHashes - array of dataHashes as hex strings
 * @param privKey - private key of signer
 */
export const signChecksum = (dataHashes: string[], privKey: Buffer): string => {
  return signHash(getChecksum(dataHashes), privKey)
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
    .map(() => hashMessage(randomBytes(20).toString()))
}
/**
 * Given attestation data and the attester's private key, construct the entire Bloom Merkle tree
 * and return the components needed to generate proofs
 * @param claimNodes - Complete attestation nodes
 * @param privKey - Attester private key
 */
export const getSignedMerkleTreeComponents = (
  claimNodes: IClaimNode[],
  issuanceDate: string,
  expirationDate: string,
  privKey: Buffer,
  opts?: {
    paddingNodes?: string[]
    localRevocationLinks?: string[]
    globalRevocationLink?: string
    rootHashNonce?: string
  },
): IBloomMerkleTreeComponents => {
  const globalRevocationLink = (opts && opts.globalRevocationLink) || generateNonce()
  const signedClaimNodes: ISignedClaimNode[] = claimNodes.map((a, i) => {
    return getSignedClaimNode(
      a,
      globalRevocationLink,
      privKey,
      issuanceDate,
      expirationDate,
      opts && opts.localRevocationLinks ? opts.localRevocationLinks[i] : undefined,
    )
  })
  const attesterClaimSigHashes = signedClaimNodes.map(a => hashMessage(a.attesterSig))

  const paddingNodes = (opts && opts.paddingNodes) || getPadding(attesterClaimSigHashes.length)
  const signedChecksum = signChecksum(attesterClaimSigHashes, privKey)
  const signedChecksumHash = hashMessage(signedChecksum)
  const rootHash = getBloomMerkleTree(attesterClaimSigHashes, paddingNodes, signedChecksumHash).getRoot()
  const signedRootHash = signHash(rootHash, privKey)
  const rootHashNonce = (opts && opts.rootHashNonce) || generateNonce()
  const layer2Hash = hashMessage(
    orderedStringify({
      rootHash: ethUtil.bufferToHex(rootHash),
      nonce: rootHashNonce,
    }),
  )
  const attester = EthWallet.fromPrivateKey(privKey)
  return {
    attester: attester.getAddressString(),
    layer2Hash: layer2Hash,
    attesterSig: signedRootHash,
    rootHashNonce: rootHashNonce,
    rootHash: ethUtil.bufferToHex(rootHash),
    claimNodes: signedClaimNodes,
    checksumSig: signedChecksum,
    paddingNodes: paddingNodes,
    version: 'Attestation-Tree-2.0.0',
  }
}

/**
 * Given attestation data and the attester's private key, construct the entire Bloom Merkle tree
 * and return the components needed to generate proofs
 * @param claimNodes - Complete attestation nodes
 * @param privKey - Attester private key
 */
/**
 * Given attestation data and the attester's private key, construct the entire Bloom Merkle tree
 * and return the components needed to generate proofs
 * @param dataNodes - Complete attestation nodes
 * @param privKey - Attester private key
 */
export const getSignedMerkleTreeComponentsLegacy = (dataNodes: IAttestationLegacy[], privKey: Buffer): IBloomMerkleTreeComponentsLegacy => {
  const globalRevocationLink = generateNonce()
  const signedDataNodes: IDataNodeLegacy[] = dataNodes.map(a => {
    return getSignedDataNode(a, globalRevocationLink, privKey)
  })
  const signedDataHashes = signedDataNodes.map(a => hashMessage(a.signedAttestation))

  const paddingNodes = getPadding(signedDataHashes.length)
  const signedChecksum = signChecksum(signedDataHashes, privKey)
  const signedChecksumHash = hashMessage(signedChecksum)
  const rootHash = getBloomMerkleTree(signedDataHashes, paddingNodes, signedChecksumHash).getRoot()
  const signedRootHash = signHash(rootHash, privKey)
  const rootHashNonce = generateNonce()
  const layer2Hash = hashMessage(
    orderedStringify({
      rootHash: ethUtil.bufferToHex(rootHash),
      nonce: rootHashNonce,
    }),
  )
  return {
    layer2Hash: layer2Hash,
    signedRootHash: signedRootHash,
    rootHashNonce: rootHashNonce,
    rootHash: ethUtil.bufferToHex(rootHash),
    dataNodes: signedDataNodes,
    checksumSig: signedChecksum,
    paddingNodes: paddingNodes,
  }
}

export const getMerkleTreeFromComponentsLegacy = (components: IBloomMerkleTreeComponentsLegacy): MerkleTree => {
  const signedDataHashes = components.dataNodes.map(a => hashMessage(a.signedAttestation))
  return getBloomMerkleTree(signedDataHashes, components.paddingNodes, hashMessage(components.checksumSig))
}

export const getMerkleTreeFromComponents = (components: IBloomMerkleTreeComponents | IBloomBatchMerkleTreeComponents): MerkleTree => {
  const signedDataHashes = components.claimNodes.map(a => hashMessage(a.attesterSig))
  return getBloomMerkleTree(signedDataHashes, components.paddingNodes, hashMessage(components.checksumSig))
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
 * standalone verify function taken from https://github.com/miguelmota/merkletreejs
 */
export const verifyMerkleProof = (proof: IProof[], targetNode: Buffer, root: Buffer): boolean => {
  // Should not succeed with all empty arguments
  // Proof can be empty if single leaf tree
  if (targetNode.toString() === '' || root.toString() === '') {
    return false
  }

  // Initialize hash with only targetNode data
  let hash = targetNode

  // Build hash using each component of proof until the root node
  proof.forEach(node => {
    const isLeftNode = node.position === 'left'
    const buffers = [hash]
    buffers[isLeftNode ? 'unshift' : 'push'](node.data)
    hash = Buffer.from(keccak256(Buffer.concat(buffers)), 'hex')
  })

  return Buffer.compare(hash, root) === 0
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

export const getSignedBatchMerkleTreeComponents = (
  components: IBloomMerkleTreeComponents,
  contractAddress: string,
  subjectSig: string,
  subject: string,
  requestNonce: string,
  privKey: Buffer,
): IBloomBatchMerkleTreeComponents => {
  if (!validateSignedAgreement(subjectSig, contractAddress, components.layer2Hash, requestNonce, subject)) {
    throw new Error('Invalid subject sig')
  }
  const batchAttesterSig = signHash(
    ethUtil.toBuffer(
      hashMessage(
        orderedStringify({
          subject: subject,
          rootHash: components.layer2Hash,
        }),
      ),
    ),
    privKey,
  )
  const batchLayer2Hash = hashMessage(
    orderedStringify({
      attesterSig: batchAttesterSig,
      subjectSig: subjectSig,
    }),
  )
  const attester = EthWallet.fromPrivateKey(privKey)
  return {
    attesterSig: components.attesterSig,
    batchAttesterSig: batchAttesterSig,
    batchLayer2Hash: batchLayer2Hash,
    checksumSig: components.checksumSig,
    claimNodes: components.claimNodes,
    contractAddress: contractAddress,
    layer2Hash: components.layer2Hash,
    paddingNodes: components.paddingNodes,
    requestNonce: requestNonce,
    rootHash: components.rootHash,
    rootHashNonce: components.rootHashNonce,
    attester: attester.getAddressString(),
    subject: subject,
    subjectSig: subjectSig,
    version: 'Batch-Attestation-Tree-1.0.0',
  }
}

/**
 * Validate a hex encoded signature string
 *
 * @param signatureString A signature string like "0x123456..."
 */
export const isValidSignatureString = (signatureString: string): boolean => {
  let signature: ethUtil.ECDSASignature
  try {
    signature = ethUtil.fromRpcSig(signatureString)
  } catch {
    return false
  }
  const {v, r, s} = signature
  return ethUtil.isValidSignature(v, r, s, true)
}

export const isValidEthHexString = (hexString: string): boolean => {
  return hexString.slice(0, 2) === '0x'
}

export const isValidHash = (value: string) => isValidEthHexString(value) && value.length === 66

export const isArrayOfPaddingNodes = (value: any): boolean => {
  if (!Array.isArray(value)) {
    return false
  }
  if (value.length === 0) return false
  return value.every(v => v.length === 66)
}

export const isValidTypeString = (value: any): boolean => Object.values(AttestationTypeID).includes(value)

export const isValidRFC3339DateTime = (value: any): boolean => validateDateTime(value)

export const validateAttesterClaimSig = (attesterSig: any, params: any) => {
  const claimHash = hashClaimTree(params.claimNode)
  const recoveredSigner = recoverHashSigner(claimHash, attesterSig)
  return recoveredSigner.toLowerCase() === params.attester.toLowerCase()
}

export const validateAttesterRootSig = (attesterSig: any, params: any) => {
  const recoveredSigner = recoverHashSigner(ethUtil.toBuffer(params.rootHash), attesterSig)
  return recoveredSigner.toLowerCase() === params.attester.toLowerCase()
}

export const validateBatchAttesterSig = (batchAttesterSig: any, params: any) => {
  const recoveredSigner = recoverHashSigner(
    ethUtil.toBuffer(
      hashMessage(
        orderedStringify({
          subject: params.subject,
          rootHash: params.layer2Hash,
        }),
      ),
    ),
    batchAttesterSig,
  )
  return recoveredSigner.toLowerCase() === params.attester.toLowerCase()
}

export const validateSubjectSig = (subjectSig: string, params: any) => {
  const recoveredSigner = ethSigUtil.recoverTypedSignature({
    data: getAttestationAgreement(params.contractAddress, 1, params.layer2Hash, params.requestNonce),
    sig: subjectSig,
  })
  return recoveredSigner.toLowerCase() === params.subject.toLowerCase()
}

export const validateChecksumSig = (checksumSig: string, params: any) => {
  const checksum = getChecksum(params.claimNodes.map((a: ISignedClaimNode) => hashMessage(a.attesterSig)))
  const recoveredSigner = recoverHashSigner(checksum, checksumSig)
  return recoveredSigner.toLowerCase() === params.attester.toLowerCase()
}

export const validateAttestationDataNode = genValidateFn({
  data: isNotEmptyString,
  nonce: isNotEmptyString,
  version: isNotEmptyString,
})

export const validateAttestationTypeNode = genValidateFn({
  type: [isNotEmptyString, isValidTypeString],
  nonce: isNotEmptyString,
})

export const validateLinkNode = genValidateFn({
  local: isValidHash,
  global: isValidHash,
  dataHash: isValidHash,
  typeHash: isValidHash,
})

export const validateAttestationIssuanceNode = genValidateFn({
  localRevocationToken: [isValidHash, isValidEthHexString],
  globalRevocationToken: [isValidHash, isValidEthHexString],
  dataHash: [isValidHash, isValidEthHexString],
  typeHash: [isValidHash, isValidEthHexString],
  issuanceDate: [isNotEmptyString, isValidRFC3339DateTime],
  expirationDate: [isNotEmptyString, isValidRFC3339DateTime],
})

export const isValidAttestationDataNode = (value: any): boolean => validateAttestationDataNode(value).kind === 'validated'

export const isValidAttestationTypeNode = (value: any): boolean => validateAttestationTypeNode(value).kind === 'validated'

export const isValidAttestationIssuanceNode = (value: any): boolean => validateAttestationIssuanceNode(value).kind === 'validated'

export const isValidLinkNode = (value: any): boolean => validateLinkNode(value).kind === 'validated'

export const validateLegacyAttestationNode = genValidateFn({
  data: isValidAttestationDataNode,
  type: isValidAttestationTypeNode,
  link: isValidLinkNode,
  aux: [isValidEthHexString, isValidHash],
})

export const isValidLegacyAttestationNode = (value: any): boolean => validateLegacyAttestationNode(value).kind === 'validated'

export const validateIssueClaimNode = genValidateFn({
  data: isValidAttestationDataNode,
  type: isValidAttestationTypeNode,
  issuance: isValidAttestationIssuanceNode,
  aux: [isValidEthHexString, isValidHash],
})

export const isValidIssuedClaimNode = (value: any): boolean => validateIssueClaimNode(value).kind === 'validated'

export const validateClaimNode = genValidateFn({
  attesterSig: [isValidSignatureString, validateAttesterClaimSig],
  claimNode: isValidIssuedClaimNode,
})

export const isValidArrayOfClaimNodes = (value: any): boolean => {
  if (!Array.isArray(value)) return false
  if (value.length === 0) return false
  return value.every(v => validateClaimNode(v).kind === 'validated')
}

export const validateDataNodeLegacy = genValidateFn({
  signedAttestation: isValidSignatureString,
  // cannot validate attestation sig matches attester here. missing in data structure
  attestationNode: isValidLegacyAttestationNode,
})

export const isValidArrayOfLegacyDataNodes = (value: any): boolean => {
  if (!Array.isArray(value)) return false
  if (value.length === 0) return false
  return value.every(v => validateDataNodeLegacy(v).kind === 'validated')
}

export const validateBloomLegacyMerkleTreeComponents = genValidateFn({
  layer2Hash: isValidHash,
  signedRootHash: isValidSignatureString,
  rootHashNonce: isValidHash,
  rootHash: isValidHash,
  dataNodes: isValidArrayOfLegacyDataNodes,
  checksumSig: isValidSignatureString,
  paddingNodes: isArrayOfPaddingNodes,
})

export const validateBloomMerkleTreeComponents = genValidateFn({
  attesterSig: [isValidSignatureString, validateAttesterRootSig],
  checksumSig: [isValidSignatureString, validateChecksumSig],
  claimNodes: isValidArrayOfClaimNodes,
  layer2Hash: [isValidEthHexString, isValidHash],
  paddingNodes: isArrayOfPaddingNodes,
  rootHash: [isValidEthHexString, isValidHash],
  rootHashNonce: [isValidHash, isValidEthHexString],
  version: isNotEmptyString,
})

export const validateBloomBatchMerkleTreeComponents = genValidateFn({
  attesterSig: [isValidSignatureString, validateAttesterRootSig],
  checksumSig: [isValidSignatureString, validateChecksumSig],
  claimNodes: isValidArrayOfClaimNodes,
  layer2Hash: [isValidEthHexString, isValidHash],
  paddingNodes: isArrayOfPaddingNodes,
  rootHash: [isValidEthHexString, isValidHash],
  rootHashNonce: [isValidHash, isValidEthHexString],
  version: isNotEmptyString,
  batchAttesterSig: [isValidSignatureString, validateBatchAttesterSig],
  contractAddress: ethUtil.isValidAddress,
  requestNonce: [isValidHash, isValidEthHexString],
  subject: ethUtil.isValidAddress,
  subjectSig: [isValidSignatureString, validateSubjectSig],
})

interface IEthDidDocumentPublicKey extends IDidDocumentPublicKey {
  ethereumAddress: string
}
interface IEthDidDocument extends IDidDocument {
  publicKey?: IEthDidDocumentPublicKey[]
}

const ethrDidDocumentTmpl = (ethAddress: string): IEthDidDocument => ({
  '@context': 'https://w3id.org/did/v1',
  id: `did:ethr:${ethAddress}`,
  publicKey: [
    {
      id: `did:ethr:${ethAddress}#owner`,
      type: 'Secp256k1VerificationKey2018',
      controller: `did:ethr:${ethAddress}`,
      ethereumAddress: ethAddress,
    },
  ],
  authentication: [
    {
      type: 'Secp256k1SignatureAuthentication2018',
      publicKey: `did:ethr:${ethAddress}#owner`,
    },
  ],
})

/**
 * Simplified "resolver", that just uses a template to avoid unnecessary performance issues.
 */
export class EthereumDIDResolver implements IDidResolver {
  public async resolve(did: string): Promise<IDidResolveResult> {
    if (!isValidDID(did)) {
      throw Error('unable to resolve did document')
    }

    const didDocument = ethrDidDocumentTmpl(did.replace('did:ethr:', ''))
    return {
      didDocument: new DidDocument(didDocument),
    }
  }
}

export const isValidDID = (value: any): value is string => {
  if (typeof value !== 'string') return false

  return value.startsWith('did:ethr:') && ethUtil.isValidAddress(value.replace('did:ethr:', ''))
}
