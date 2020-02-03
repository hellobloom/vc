import {EthUtils, AtomicVCV1, AtomicVCSubjectV1} from '@bloomprotocol/attestations-common'
import EthWallet from 'ethereumjs-wallet'

const {EcdsaSecp256k1KeyClass2019, EcdsaSecp256k1Signature2019, defaultDocumentLoader} = require('@transmute/lds-ecdsa-secp256k1-2019')
const keyto = require('@trust/keyto')
const jsigs = require('jsonld-signatures')
const {AssertionProofPurpose} = jsigs.purposes

export const buildAtomicVCV1 = async <D extends {}>({
  subject: _subject,
  type,
  data,
  privateKey,
  issuanceDate,
  expirationDate,
}: {
  subject: string
  type: string[]
  data: D
  privateKey: Buffer
  issuanceDate: string
  expirationDate?: string
}): Promise<AtomicVCV1<AtomicVCSubjectV1<D>>> => {
  const {didDocument: subjectDidDoc} = await new EthUtils.EthereumDIDResolver().resolve(_subject)

  const issuer = EthWallet.fromPrivateKey(privateKey)
  const {didDocument: issuerDidDoc} = await new EthUtils.EthereumDIDResolver().resolve(`did:ethr:${issuer.getAddressString()}`)

  const unsignedCred: Omit<AtomicVCV1, 'proof'> = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiableCredential', 'AtomicCredential', ...type],
    issuer: `did:ethr:${issuer.getAddressString()}`,
    issuanceDate,
    expirationDate,
    credentialSubject: {
      id: subjectDidDoc.id,
      ...data,
    },
  }

  const credential: AtomicVCV1<AtomicVCSubjectV1<D>> = await jsigs.sign(unsignedCred, {
    suite: new EcdsaSecp256k1Signature2019({
      key: new EcdsaSecp256k1KeyClass2019({
        id: issuerDidDoc.publicKey[0].id,
        controller: issuerDidDoc.publicKey[0].controller,
        privateKeyJwk: keyto.from(issuer.getPrivateKeyString().replace('0x', ''), 'blk').toJwk('private'),
      }),
    }),
    documentLoader: defaultDocumentLoader,
    purpose: new AssertionProofPurpose(),
  })

  return credential
}
