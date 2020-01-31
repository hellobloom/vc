import {
  FullVCV1,
  FullVCProofV1,
  FullVCSignedAuthorizationV1,
  VCSignedClaimNodeV1,
  SDVCV1,
  SDBatchVCV1,
  EthUtils,
  IProof,
  IMerkleProofShare,
  VerifiablePresentationV1,
  VerifiablePresentationProofV1,
} from '@bloomprotocol/attestations-common'
import * as EthU from 'ethereumjs-util'
import EthWallet from 'ethereumjs-wallet'
const {EcdsaSecp256k1KeyClass2019, EcdsaSecp256k1Signature2019, defaultDocumentLoader} = require('@transmute/lds-ecdsa-secp256k1-2019')
const keyto = require('@trust/keyto')
const jsigs = require('jsonld-signatures')
const {AuthenticationProofPurpose, AssertionProofPurpose} = jsigs.purposes

const getMerkleTreeFromSDVCV1 = (vc: SDVCV1 | SDBatchVCV1) => {
  const signedDataHashes = vc.credentialSubject.claimNodes.map(claimNode => EthUtils.hashMessage(claimNode.issuerSignature))
  return EthUtils.getBloomMerkleTree(signedDataHashes, vc.proof.paddingNodes, EthUtils.hashMessage(vc.proof.checksumSignature))
}

const formatMerkleProofForShare = (proof: IProof[]): IMerkleProofShare[] =>
  proof.map(({position, data}) => ({
    position: position,
    data: '0x' + data.toString('hex'),
  }))

const buildBaseFullVCV1 = async ({
  buildProof,
  subject,
  authorization,
  target,
  sdvc,
}: {
  buildProof: (unsignedVC: Omit<FullVCV1, 'proof'>) => Promise<FullVCProofV1>
  subject: string
  authorization: FullVCSignedAuthorizationV1[]
  target: VCSignedClaimNodeV1
  sdvc: SDVCV1 | SDBatchVCV1
}): Promise<FullVCV1> => {
  const unsignedVC: Omit<FullVCV1, 'proof'> = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    id: 'placeholder',
    type: ['VerifiableCredential', 'FullCredential', target.claimNode.type.type],
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

const buildBatchFullVCProofV1 = async ({
  unsignedVC,
  stage,
  target,
  sdvc,
  wallet,
}: {
  unsignedVC: Omit<FullVCV1, 'proof'>
  stage: 'mainnet' | 'rinkeby' | 'local'
  target: VCSignedClaimNodeV1
  sdvc: SDBatchVCV1
  wallet: EthWallet
}): Promise<FullVCProofV1> => {
  const bloomMerkleTree = getMerkleTreeFromSDVCV1(sdvc)
  const merkleproof = formatMerkleProofForShare(bloomMerkleTree.getProof(EthU.toBuffer(EthUtils.hashMessage(target.issuerSignature))))
  const {didDocument} = await new EthUtils.EthereumDIDResolver().resolve(`did:ethr:${wallet.getAddressString()}`)
  const publicKey = didDocument.publicKey[0]

  const {proof} = jsigs.sign(unsignedVC, {
    suite: new EcdsaSecp256k1Signature2019({
      key: new EcdsaSecp256k1KeyClass2019({
        id: publicKey.id,
        controller: publicKey.controller,
        privateKeyJwk: keyto.from(wallet.getPrivateKeyString().replace('0x', ''), 'blk').toJwk('private'),
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

export const buildBatchFullVCV1 = async ({
  subject,
  stage,
  target,
  sdvc,
  authorization,
  wallet,
}: {
  subject: string
  stage: 'mainnet' | 'rinkeby' | 'local'
  target: VCSignedClaimNodeV1
  sdvc: SDBatchVCV1
  authorization: FullVCSignedAuthorizationV1[]
  wallet: EthWallet
}): Promise<FullVCV1> =>
  await buildBaseFullVCV1({
    subject,
    authorization,
    target,
    sdvc,
    buildProof: async unsignedVC =>
      await buildBatchFullVCProofV1({
        unsignedVC,
        stage,
        target,
        sdvc,
        wallet,
      }),
  })

const buildVerifiablePresentationV1Proof = async ({
  unsignedVP,
  token,
  domain,
  wallet,
}: {
  unsignedVP: Omit<VerifiablePresentationV1, 'proof'>
  token: string
  domain: string
  wallet: EthWallet
}): Promise<VerifiablePresentationProofV1> => {
  const {didDocument} = await new EthUtils.EthereumDIDResolver().resolve(`did:ethr:${wallet.getAddressString()}`)
  const publicKey = didDocument.publicKey[0]

  const {proof} = jsigs.sign(unsignedVP, {
    suite: new EcdsaSecp256k1Signature2019({
      key: new EcdsaSecp256k1KeyClass2019({
        id: publicKey.id,
        controller: publicKey.controller,
        privateKeyJwk: keyto.from(wallet.getPrivateKeyString().replace('0x', ''), 'blk').toJwk('private'),
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
  wallet,
  fullCredentials,
  token,
  domain,
}: {
  fullCredentials: FullVCV1[]
  token: string
  domain: string
  wallet: EthWallet
}): Promise<VerifiablePresentationV1> => {
  const unsignedVP: Omit<VerifiablePresentationV1<FullVCV1>, 'proof'> = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiablePresentation'],
    verifiableCredential: fullCredentials,
    holder: `did:ethr:${wallet.getAddressString()}`,
  }

  const proof = await buildVerifiablePresentationV1Proof({unsignedVP, wallet, token, domain})

  return {
    ...unsignedVP,
    proof,
  }
}
