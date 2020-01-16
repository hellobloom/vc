import {
  TAttestationTypeNames,
  EthUtils,
  validateDateTime,
  Utils,
  VCClaimNodeV1,
  VCSignedClaimNodeV1,
  VCIssuedClaimNodeV1,
  SelectivelyDisclosableVCV1,
  SelectivelyDisclosableBatchVCV1,
} from '@bloomprotocol/attestations-common'
import {uuid} from 'uuidv4'
import {keccak256} from 'js-sha3'
import EthWallet from 'ethereumjs-wallet'
import * as ethUtil from 'ethereumjs-util'

import {MerkleTree} from '../merketreejs'
import {getMerkleTreeFromLeaves, getBloomMerkleTree, getPadding, validateSignedAgreement} from '../utils'

/**
 *
 * @param claim Given the contents of an attestation node, return a
 * Merkle tree
 */
const getClaimTree = (claim: VCIssuedClaimNodeV1): MerkleTree => {
  const dataHash = EthUtils.hashMessage(Utils.orderedStringify(claim.data))
  const typeHash = EthUtils.hashMessage(Utils.orderedStringify(claim.type))
  const issuanceHash = EthUtils.hashMessage(Utils.orderedStringify(claim.issuance))
  const auxHash = EthUtils.hashMessage(claim.aux)
  return getMerkleTreeFromLeaves([dataHash, typeHash, issuanceHash, auxHash])
}

/**
 * Given the contents of an attestation node, return the root hash of the Merkle tree
 */
const hashClaimTree = (claim: VCIssuedClaimNodeV1): Buffer => {
  const dataTree = getClaimTree(claim)
  return dataTree.getRoot()
}

export const buildClaimNodeV1 = ({
  dataStr,
  type,
  provider,
  version,
}: {
  dataStr: string
  type: TAttestationTypeNames
  provider: string
  version: string
}): VCClaimNodeV1 => ({
  data: {
    data: dataStr,
    nonce: keccak256(uuid()),
    version,
  },
  type: {
    type,
    provider,
    nonce: keccak256(uuid()),
  },
  aux: EthUtils.generateNonce(),
})

const signVCClaimNodeV1 = ({
  claimNode,
  globalRevocationToken,
  privateKey,
  issuanceDate,
  expirationDate,
  localRevocationToken,
}: {
  claimNode: VCClaimNodeV1
  globalRevocationToken: string
  privateKey: Buffer
  issuanceDate: string
  expirationDate: string
  localRevocationToken?: string
}) => {
  if (!validateDateTime(issuanceDate)) throw new Error('Invalid issuance date')
  if (!validateDateTime(expirationDate)) throw new Error('Invalid expiration date')

  const issuedClaimNode: VCIssuedClaimNodeV1 = {
    ...claimNode,
    issuance: {
      localRevocationToken: localRevocationToken || EthUtils.generateNonce(),
      globalRevocationToken,
      dataHash: EthUtils.hashMessage(Utils.orderedStringify(claimNode.data)),
      typeHash: EthUtils.hashMessage(Utils.orderedStringify(claimNode.type)),
      issuanceDate,
      expirationDate,
    },
  }

  const claimHash = hashClaimTree(issuedClaimNode)
  const issuerSignature = EthUtils.signHash(claimHash, privateKey)
  const issuer = EthWallet.fromPrivateKey(privateKey).getAddressString()

  const signedClaimNode: VCSignedClaimNodeV1 = {
    claimNode: issuedClaimNode,
    issuer,
    issuerSignature,
  }

  return signedClaimNode
}

export const buildSelectivelyDisclosableVCV1 = ({
  claimNodes,
  subject,
  issuanceDate,
  expirationDate,
  privateKey,
  paddingNodes: _paddingNodes,
  globalRevocationToken,
  localRevocationTokens,
  rootHashNonce: _rootHashNonce,
}: {
  claimNodes: VCClaimNodeV1[]
  subject: string
  issuanceDate: string
  expirationDate: string
  privateKey: Buffer
  paddingNodes?: string[]
  globalRevocationToken?: string
  localRevocationTokens?: string[]
  rootHashNonce?: string
}) => {
  const signedClaimNodes = claimNodes.map((claimNode, i) =>
    signVCClaimNodeV1({
      claimNode,
      privateKey,
      issuanceDate,
      expirationDate,
      globalRevocationToken: globalRevocationToken || EthUtils.generateNonce(),
      localRevocationToken: localRevocationTokens ? localRevocationTokens[i] : undefined,
    }),
  )
  const issuerClaimSigHashes = signedClaimNodes.map(({issuerSignature}) => EthUtils.hashMessage(issuerSignature))
  const paddingNodes = _paddingNodes || getPadding(issuerClaimSigHashes.length)
  const signedChecksum = EthUtils.signChecksum(issuerClaimSigHashes, privateKey)
  const signedChecksumHash = EthUtils.hashMessage(signedChecksum)
  const rootHash = getBloomMerkleTree(issuerClaimSigHashes, paddingNodes, signedChecksumHash).getRoot()
  const signedRootHash = EthUtils.signHash(rootHash, privateKey)
  const rootHashNonce = _rootHashNonce || EthUtils.generateNonce()
  const layer2Hash = EthUtils.hashMessage(
    Utils.orderedStringify({
      rootHash: ethUtil.bufferToHex(rootHash),
      nonce: rootHashNonce,
    }),
  )
  const issuer = EthWallet.fromPrivateKey(privateKey).getAddressString()

  const credential: SelectivelyDisclosableVCV1 = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    id: 'placeholder',
    type: ['VerifiableCredential', 'SelectivelyDisclosableVerifiableCredential'],
    issuer,
    issuanceDate,
    expirationDate,
    credentialSubject: {
      id: subject,
      claimNodes: signedClaimNodes,
    },
    proof: {
      issuerSignature: signedRootHash,
      layer2Hash,
      checksumSignature: signedChecksum,
      paddingNodes: paddingNodes,
      rootHashNonce,
      rootHash: ethUtil.bufferToHex(rootHash),
    },
    version: 'SelectivelyDisclosableVC-1.0.0',
  }

  return credential
}

export const buildSelectivelyDisclosableBatchVCV1 = ({
  credential,
  privateKey,
  contractAddress,
  subjectSignature,
  requestNonce,
}: {
  credential: SelectivelyDisclosableVCV1
  privateKey: Buffer
  contractAddress: string
  subjectSignature: string
  requestNonce: string
}) => {
  const {
    issuer,
    credentialSubject: {id: subject},
    proof: {layer2Hash: rootHash},
  } = credential

  if (!validateSignedAgreement(subjectSignature, contractAddress, rootHash, requestNonce, subject)) {
    throw new Error('Invalid subject sig')
  }

  if (issuer !== EthWallet.fromPrivateKey(privateKey).getAddressString()) {
    throw new Error('Private key mismatch')
  }

  const batchIssuerSignature = EthUtils.signHash(
    ethUtil.toBuffer(EthUtils.hashMessage(Utils.orderedStringify({subject, rootHash}))),
    privateKey,
  )
  const batchLayer2Hash = EthUtils.hashMessage(
    Utils.orderedStringify({
      issuerSignature: batchIssuerSignature,
      subjectSignature,
    }),
  )

  const batchCredential: SelectivelyDisclosableBatchVCV1 = {
    ...credential,
    type: [credential.type[0], credential.type[1], 'SelectivelyDisclosableBatchVerifiableCredential', ...credential.type.slice(2)],
    proof: {
      ...credential.proof,
      contractAddress,
      batchLayer2Hash,
      batchIssuerSignature,
      requestNonce,
      subjectSignature,
    },
    version: 'SelectivelyDisclosableBatchVC-1.0.0',
  }

  return batchCredential
}
