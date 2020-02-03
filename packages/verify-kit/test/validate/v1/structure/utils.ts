import {
  EthUtils,
  AtomicVCProofV1,
  VCLegacySignedDataNodeV1,
  VCSignedClaimNodeV1,
  SDVCV1,
  SDBatchVCV1,
  AtomicVCSignedAuthorizationV1,
  AtomicVCV1,
  VerifiablePresentationProofV1,
  VerifiablePresentationV1,
  SDLegacyVCV1,
} from '@bloomprotocol/attestations-common'
import * as EthU from 'ethereumjs-util'
import EthWallet from 'ethereumjs-wallet'
const {EcdsaSecp256k1KeyClass2019, EcdsaSecp256k1Signature2019, defaultDocumentLoader} = require('@transmute/lds-ecdsa-secp256k1-2019')
const keyto = require('@trust/keyto')
const jsigs = require('jsonld-signatures')
const {AuthenticationProofPurpose, AssertionProofPurpose} = jsigs.purposes

import {formatMerkleProofForShare} from '../../../../src/utils'

export type Holder = {
  private: Buffer
  privateStringHex: string
  privateString: string
  publicStringHex: string
  publicString: string
}

export const getHolder = (wallet: EthWallet): Holder => {
  const privateKey = wallet.getPrivateKey()
  const privateStringHex = wallet.getPrivateKeyString()
  const privateString = privateStringHex.replace('0x', '')

  const publicStringHex = wallet.getAddressString()
  const publicString = publicStringHex.replace('0x', '')

  return {
    private: privateKey,
    privateStringHex,
    privateString,
    publicStringHex,
    publicString,
  }
}

export const getMerkleTreeFromSelectivlelyDisclosableLegacyVCV1 = (vc: SDLegacyVCV1) => {
  vc.credentialSubject.dataNodes
  const signedDataHashes = vc.credentialSubject.dataNodes.map(dataNode => EthUtils.hashMessage(dataNode.signedAttestation))
  return EthUtils.getBloomMerkleTree(signedDataHashes, vc.proof.paddingNodes, EthUtils.hashMessage(vc.proof.checksumSig))
}

export const getMerkleTreeFromSDVCV1 = (vc: SDVCV1 | SDBatchVCV1) => {
  const signedDataHashes = vc.credentialSubject.claimNodes.map(claimNode => EthUtils.hashMessage(claimNode.issuerSignature))
  return EthUtils.getBloomMerkleTree(signedDataHashes, vc.proof.paddingNodes, EthUtils.hashMessage(vc.proof.checksumSignature))
}

const buildBaseAtomicVCV1 = async ({
  buildProof,
  subject,
  authorization,
  target,
  sdvc,
}: {
  buildProof: (unsignedVC: Omit<AtomicVCV1, 'proof'>) => Promise<AtomicVCProofV1>
  subject: string
  authorization: AtomicVCSignedAuthorizationV1[]
  target: VCSignedClaimNodeV1
  sdvc: SDVCV1 | SDBatchVCV1
}): Promise<AtomicVCV1> => {
  const unsignedVC: Omit<AtomicVCV1, 'proof'> = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    id: 'placeholder',
    type: ['VerifiableCredential', 'AtomicCredential', target.claimNode.type.type],
    issuer: sdvc.issuer,
    issuanceDate: target.claimNode.issuance.issuanceDate,
    expirationDate: target.claimNode.issuance.expirationDate,
    credentialSubject: {
      id: subject,
      data: target.claimNode.data.data,
      authorization,
    },
  }

  const proof = await buildProof(unsignedVC)

  return {
    ...unsignedVC,
    proof,
  }
}

const buildLegacyAtomicVCProofV1 = async ({
  unsignedVC,
  tx,
  stage,
  target,
  sdvc,
  holder,
}: {
  unsignedVC: Omit<AtomicVCV1, 'proof'>
  tx: string
  stage: 'mainnet' | 'rinkeby' | 'local'
  target: VCLegacySignedDataNodeV1
  sdvc: SDLegacyVCV1
  holder: Holder
}): Promise<AtomicVCProofV1> => {
  const bloomMerkleTree = getMerkleTreeFromSelectivlelyDisclosableLegacyVCV1(sdvc)
  const merkleproof = formatMerkleProofForShare(bloomMerkleTree.getProof(EthU.toBuffer(EthUtils.hashMessage(target.signedAttestation))))
  const {didDocument} = await new EthUtils.EthereumDIDResolver().resolve(`did:ethr:${holder.publicStringHex}`)
  const publicKey = didDocument.publicKey[0]

  const signed = jsigs.sign(unsignedVC, {
    suite: new EcdsaSecp256k1Signature2019({
      key: new EcdsaSecp256k1KeyClass2019({
        id: publicKey.id,
        controller: publicKey.controller,
        privateKeyJwk: keyto.from(holder.privateString, 'blk').toJwk('private'),
      }),
    }),
    documentLoader: defaultDocumentLoader,
    purpose: new AssertionProofPurpose(),
  })

  const {proof} = signed

  console.log({signed})
  console.log({proof})

  return {
    ...proof,
    data: {
      version: 'legacy',
      tx,
      layer2Hash: sdvc.proof.layer2Hash,
      rootHash: sdvc.proof.rootHash,
      rootHashNonce: sdvc.proof.rootHashNonce,
      proof: merkleproof,
      stage,
      target,
      attester: sdvc.issuer,
    },
  }
}

const buildOnChainAtomicVCProofV1 = async ({
  unsignedVC,
  tx,
  stage,
  target,
  sdvc,
  holder,
}: {
  unsignedVC: Omit<AtomicVCV1, 'proof'>
  tx: string
  stage: 'mainnet' | 'rinkeby' | 'local'
  target: VCSignedClaimNodeV1
  sdvc: SDVCV1
  holder: Holder
}): Promise<AtomicVCProofV1> => {
  const bloomMerkleTree = getMerkleTreeFromSDVCV1(sdvc)
  const merkleproof = formatMerkleProofForShare(bloomMerkleTree.getProof(EthU.toBuffer(EthUtils.hashMessage(target.issuerSignature))))
  const {didDocument} = await new EthUtils.EthereumDIDResolver().resolve(`did:ethr:${holder.publicStringHex}`)
  const publicKey = didDocument.publicKey[0]

  const signed = await jsigs.sign(unsignedVC, {
    suite: new EcdsaSecp256k1Signature2019({
      key: new EcdsaSecp256k1KeyClass2019({
        id: publicKey.id,
        controller: publicKey.controller,
        privateKeyJwk: keyto.from(holder.privateString, 'blk').toJwk('private'),
      }),
    }),
    documentLoader: defaultDocumentLoader,
    purpose: new AssertionProofPurpose(),
  })

  const {proof} = signed

  console.log({signed})
  console.log({proof})

  return {
    ...proof,
    data: {
      version: 'onChain',
      tx,
      layer2Hash: sdvc.proof.layer2Hash,
      rootHash: sdvc.proof.rootHash,
      rootHashNonce: sdvc.proof.rootHashNonce,
      proof: merkleproof,
      stage,
      target,
      attester: sdvc.issuer,
    },
  }
}

export const buildLegacyAtomicVCV1 = async ({
  subject,
  tx,
  stage,
  target,
  sdvc,
  authorization,
  holder,
}: {
  subject: string
  tx: string
  stage: 'mainnet' | 'rinkeby' | 'local'
  target: VCLegacySignedDataNodeV1
  sdvc: SDLegacyVCV1
  authorization: AtomicVCSignedAuthorizationV1[]
  holder: Holder
}): Promise<AtomicVCV1> => {
  const unsignedVC: Omit<AtomicVCV1, 'proof'> = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    id: 'placeholder',
    type: ['VerifiableCredential', 'AtomicCredential', target.attestationNode.type.type],
    issuer: sdvc.issuer,
    issuanceDate: sdvc.issuanceDate,
    credentialSubject: {
      id: subject,
      data: target.attestationNode.data.data,
      authorization,
    },
  }

  const proof = await buildLegacyAtomicVCProofV1({
    tx,
    stage,
    target,
    sdvc,
    unsignedVC,
    holder,
  })

  return {
    ...unsignedVC,
    proof,
  }
}

export const buildOnChainAtomicVCV1 = async ({
  subject,
  tx,
  stage,
  target,
  sdvc,
  authorization,
  holder,
}: {
  subject: string
  tx: string
  stage: 'mainnet' | 'rinkeby' | 'local'
  target: VCSignedClaimNodeV1
  sdvc: SDVCV1
  authorization: AtomicVCSignedAuthorizationV1[]
  holder: Holder
}): Promise<AtomicVCV1> =>
  await buildBaseAtomicVCV1({
    subject,
    authorization,
    target,
    sdvc,
    buildProof: async unsignedVC =>
      await buildOnChainAtomicVCProofV1({
        tx,
        stage,
        target,
        sdvc,
        unsignedVC,
        holder,
      }),
  })

const buildBatchAtomicVCProofV1 = async ({
  unsignedVC,
  stage,
  target,
  sdvc,
  holder,
}: {
  unsignedVC: Omit<AtomicVCV1, 'proof'>
  stage: 'mainnet' | 'rinkeby' | 'local'
  target: VCSignedClaimNodeV1
  sdvc: SDBatchVCV1
  holder: Holder
}): Promise<AtomicVCProofV1> => {
  const bloomMerkleTree = getMerkleTreeFromSDVCV1(sdvc)
  const merkleproof = formatMerkleProofForShare(bloomMerkleTree.getProof(EthU.toBuffer(EthUtils.hashMessage(target.issuerSignature))))
  const {didDocument} = await new EthUtils.EthereumDIDResolver().resolve(`did:ethr:${holder.publicStringHex}`)
  const publicKey = didDocument.publicKey[0]

  const {proof} = jsigs.sign(unsignedVC, {
    suite: new EcdsaSecp256k1Signature2019({
      key: new EcdsaSecp256k1KeyClass2019({
        id: publicKey.id,
        controller: publicKey.controller,
        privateKeyJwk: keyto.from(holder.privateString, 'blk').toJwk('private'),
      }),
    }),
    documentLoader: defaultDocumentLoader,
    purpose: new AssertionProofPurpose(),
  })

  return {
    ...proof,
    data: {
      version: 'batch',
      batchLayer2Hash: sdvc.proof.batchLayer2Hash,
      batchAttesterSig: sdvc.proof.batchIssuerSignature,
      subjectSig: sdvc.proof.subjectSignature,
      requestNonce: sdvc.proof.requestNonce,
      layer2Hash: sdvc.proof.layer2Hash,
      rootHash: sdvc.proof.rootHash,
      rootHashNonce: sdvc.proof.rootHashNonce,
      proof: merkleproof,
      stage,
      target,
      attester: sdvc.issuer,
      subject: sdvc.credentialSubject.id,
    },
  }
}

export const buildBatchAtomicVCV1 = async ({
  subject,
  stage,
  target,
  sdvc,
  authorization,
  holder,
}: {
  subject: string
  stage: 'mainnet' | 'rinkeby' | 'local'
  target: VCSignedClaimNodeV1
  sdvc: SDBatchVCV1
  authorization: AtomicVCSignedAuthorizationV1[]
  holder: Holder
}): Promise<AtomicVCV1> =>
  await buildBaseAtomicVCV1({
    subject,
    authorization,
    target,
    sdvc,
    buildProof: async unsignedVC =>
      await buildBatchAtomicVCProofV1({
        unsignedVC,
        stage,
        target,
        sdvc,
        holder,
      }),
  })

const buildVerifiablePresentationV1Proof = async ({
  unsignedVP,
  token,
  domain,
  holder,
}: {
  unsignedVP: Omit<VerifiablePresentationV1, 'proof'>
  token: string
  domain: string
  holder: Holder
}): Promise<VerifiablePresentationProofV1> => {
  const {didDocument} = await new EthUtils.EthereumDIDResolver().resolve(`did:ethr:${holder.publicStringHex}`)
  const publicKey = didDocument.publicKey[0]

  const {proof} = jsigs.sign(unsignedVP, {
    suite: new EcdsaSecp256k1Signature2019({
      key: new EcdsaSecp256k1KeyClass2019({
        id: publicKey.id,
        controller: publicKey.controller,
        privateKeyJwk: keyto.from(holder.privateString, 'blk').toJwk('private'),
      }),
    }),
    documentLoader: defaultDocumentLoader,
    purpose: new AuthenticationProofPurpose({
      challenge: token,
      domain: domain,
    }),
  })

  return proof
}

export const buildVerifiablePresentation = async ({
  holder,
  atomicCredentials,
  token,
  domain,
}: {
  atomicCredentials: AtomicVCV1[]
  token: string
  domain: string
  holder: Holder
}): Promise<VerifiablePresentationV1> => {
  const unsignedVP: Omit<VerifiablePresentationV1<AtomicVCV1>, 'proof'> = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiablePresentation'],
    verifiableCredential: atomicCredentials,
    holder: `did:ethr:${holder.publicStringHex}`,
  }

  const proof = await buildVerifiablePresentationV1Proof({unsignedVP, holder, token, domain})

  return {
    ...unsignedVP,
    proof,
  }
}
