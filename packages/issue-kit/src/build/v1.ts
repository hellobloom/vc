import {
  EthUtils,
  validateDateTime,
  Utils,
  VCLegacyAttestationNode,
  VCLegacySignedDataNodeV1,
  VCClaimNodeV1,
  VCSignedClaimNodeV1,
  VCIssuedClaimNodeV1,
  SDLegacyVCV1,
  SDVCV1,
  SDBatchVCV1,
} from '@bloomprotocol/attestations-common'
import {uuid} from 'uuidv4'
import {keccak256} from 'js-sha3'
import EthWallet from 'ethereumjs-wallet'
import * as ethUtil from 'ethereumjs-util'

import {getMerkleTreeFromLeaves, getBloomMerkleTree, getPadding} from '../utils'

const hashClaimTree = (claim: VCIssuedClaimNodeV1): Buffer => {
  const dataHash = EthUtils.hashMessage(Utils.orderedStringify(claim.data))
  const typeHash = EthUtils.hashMessage(Utils.orderedStringify(claim.type))
  const issuanceHash = EthUtils.hashMessage(Utils.orderedStringify(claim.issuance))
  const auxHash = EthUtils.hashMessage(claim.aux)
  const dataTree = getMerkleTreeFromLeaves([dataHash, typeHash, issuanceHash, auxHash])
  return dataTree.getRoot()
}

const hashAttestationNode = (attestation: VCLegacyAttestationNode): Buffer => {
  const dataHash = EthUtils.hashMessage(Utils.orderedStringify(attestation.data))
  const typeHash = EthUtils.hashMessage(Utils.orderedStringify(attestation.type))
  const linkHash = EthUtils.hashMessage(Utils.orderedStringify(attestation.link))
  const auxHash = EthUtils.hashMessage(attestation.aux)
  const dataTree = getMerkleTreeFromLeaves([dataHash, typeHash, linkHash, auxHash])

  return dataTree.getRoot()
}

const signLegacyVCClaimNodeV1 = ({
  dataNode,
  privateKey,
  globalRevocationLink,
}: {
  dataNode: VCClaimNodeV1
  privateKey: Buffer
  globalRevocationLink: string
}): VCLegacySignedDataNodeV1 => {
  const attestationNode: VCLegacyAttestationNode = {
    ...dataNode,
    link: {
      local: EthUtils.generateNonce(),
      global: globalRevocationLink,
      dataHash: EthUtils.hashMessage(Utils.orderedStringify(dataNode.data)),
      typeHash: EthUtils.hashMessage(Utils.orderedStringify(dataNode.type)),
    },
  }

  const attestationHash = hashAttestationNode(attestationNode)
  const attestationSig = EthUtils.signHash(attestationHash, privateKey)

  return {
    attestationNode,
    signedAttestation: attestationSig,
  }
}

export const buildSDLegacyVCV1 = async ({
  dataNodes,
  subjectDID,
  privateKey,
  issuanceDate,
  expirationDate,
}: {
  dataNodes: VCClaimNodeV1[]
  subjectDID: string
  privateKey: Buffer
  issuanceDate: string
  expirationDate: string
}): Promise<SDLegacyVCV1> => {
  const {
    didDocument: {id: subject},
  } = await new EthUtils.EthereumDIDResolver().resolve(subjectDID)

  const globalRevocationLink = EthUtils.generateNonce()
  const signedDataNodes = dataNodes.map(dataNode => signLegacyVCClaimNodeV1({dataNode, privateKey, globalRevocationLink}))
  const signedDataHashes = signedDataNodes.map(dataNode => EthUtils.hashMessage(dataNode.signedAttestation))

  const paddingNodes = getPadding(signedDataHashes.length)
  const signedChecksum = EthUtils.signChecksum(signedDataHashes, privateKey)
  const signedChecksumHash = EthUtils.hashMessage(signedChecksum)
  const rootHash = getBloomMerkleTree(signedDataHashes, paddingNodes, signedChecksumHash).getRoot()
  const signedRootHash = EthUtils.signHash(rootHash, privateKey)
  const rootHashNonce = EthUtils.generateNonce()
  const layer2Hash = EthUtils.hashMessage(
    Utils.orderedStringify({
      rootHash: ethUtil.bufferToHex(rootHash),
      nonce: rootHashNonce,
    }),
  )

  const issuer = EthWallet.fromPrivateKey(privateKey).getAddressString()

  const credential: SDLegacyVCV1 = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    id: 'placeholder',
    type: ['VerifiableCredential', 'SDVerifiableLegacyCredential'],
    issuer: `did:ethr:${issuer}`,
    issuanceDate,
    expirationDate,
    credentialSubject: {
      id: subject,
      dataNodes: signedDataNodes,
    },
    proof: {
      layer2Hash,
      signedRootHash,
      rootHashNonce,
      rootHash: ethUtil.bufferToHex(rootHash),
      checksumSig: signedChecksum,
      paddingNodes,
    },
    version: 'SDLegacyVC-1.0.0',
  }

  return credential
}

export const buildClaimNodeV1 = ({
  dataStr,
  type,
  provider,
  version,
}: {
  dataStr: string
  type: string
  provider?: string
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
    issuer: `did:ethr:${issuer}`,
    issuerSignature,
  }

  return signedClaimNode
}

export const buildSDVCV1 = async ({
  claimNodes,
  subjectDID,
  issuanceDate,
  expirationDate,
  privateKey,
  paddingNodes: _paddingNodes,
  globalRevocationToken,
  localRevocationTokens,
  rootHashNonce: _rootHashNonce,
}: {
  claimNodes: VCClaimNodeV1[]
  subjectDID: string
  issuanceDate: string
  expirationDate: string
  privateKey: Buffer
  paddingNodes?: string[]
  globalRevocationToken?: string
  localRevocationTokens?: string[]
  rootHashNonce?: string
}) => {
  const {
    didDocument: {id: subject},
  } = await new EthUtils.EthereumDIDResolver().resolve(subjectDID)

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

  const credential: SDVCV1 = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    id: 'placeholder',
    type: ['VerifiableCredential', 'SDVerifiableCredential'],
    issuer: `did:ethr:${issuer}`,
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
    version: 'SDVC-1.0.0',
  }

  return credential
}

export const buildSDBatchVCV1 = async ({
  credential,
  privateKey,
  contractAddress,
  subjectSignature,
  requestNonce,
}: {
  credential: SDVCV1
  privateKey: Buffer
  contractAddress: string
  subjectSignature: string
  requestNonce: string
}) => {
  const issuerWallet = EthWallet.fromPrivateKey(privateKey)

  const {
    issuer: issuerDid,
    credentialSubject: {id: subjectDID},
    proof: {layer2Hash},
  } = credential

  const {
    didDocument: {id: issuer},
  } = await new EthUtils.EthereumDIDResolver().resolve(issuerDid)

  const {
    didDocument: {id: subject},
  } = await new EthUtils.EthereumDIDResolver().resolve(subjectDID)

  // TODO validate checksum

  // TODO validate issuer sig
  // const recoveredSigner = EthUtils.recoverHashSigner(Buffer.from(credential.proof.rootHash), credential.proof.issuerSignature)
  // if (recoveredSigner !== issuerWallet.getAddressString()) {
  //   throw new Error('Invalid issuer sig')
  // }

  if (issuer.replace('did:ethr:', '') !== issuerWallet.getAddressString()) {
    throw new Error('Private key mismatch')
  }

  if (!EthUtils.validateSignedAgreement(subjectSignature, contractAddress, layer2Hash, requestNonce, subject.replace('did:ethr:', ''))) {
    throw new Error('Invalid subject sig')
  }

  const batchIssuerSignature = EthUtils.signHash(
    ethUtil.toBuffer(EthUtils.hashMessage(Utils.orderedStringify({subject, rootHash: layer2Hash}))),
    privateKey,
  )
  const batchLayer2Hash = EthUtils.hashMessage(
    Utils.orderedStringify({
      issuerSignature: batchIssuerSignature,
      subjectSignature,
    }),
  )

  const batchCredential: SDBatchVCV1 = {
    ...credential,
    type: [credential.type[0], credential.type[1], 'SDBatchVerifiableCredential', ...credential.type.slice(2)],
    proof: {
      ...credential.proof,
      contractAddress,
      batchLayer2Hash,
      batchIssuerSignature,
      requestNonce,
      subjectSignature,
    },
    version: 'SDBatchVC-1.0.0',
  }

  return batchCredential
}
