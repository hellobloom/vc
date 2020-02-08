import {EthUtils, AtomicVCV1, AtomicVCSubjectV1, BaseVCRevocationSimpleV1} from '@bloomprotocol/attestations-common'
import EthWallet from 'ethereumjs-wallet'
import {keyUtils} from '@transmute/es256k-jws-ts'
import {EcdsaSecp256k1KeyClass2019, EcdsaSecp256k1Signature2019} from '@transmute/lds-ecdsa-secp256k1-2019'

const jsigs = require('jsonld-signatures')
const {AssertionProofPurpose} = jsigs.purposes

export const buildAtomicVCSubjectV1 = async <Data extends {'@type': string}>({
  data,
  subject,
}: {
  data: Data
  subject: string
}): Promise<AtomicVCSubjectV1<Data>> => {
  const {didDocument: subjectDidDoc} = await new EthUtils.EthereumDIDResolver().resolve(subject)

  const credentialSubject: AtomicVCSubjectV1<Data> = {
    ...data,
    identifier: subjectDidDoc.id,
  }

  return credentialSubject
}

export const buildAtomicVCV1 = async <S extends AtomicVCSubjectV1<{'@type': string}>, R extends BaseVCRevocationSimpleV1>({
  credentialSubject,
  type,
  privateKey,
  issuanceDate,
  expirationDate,
  revocation,
  context: _context,
}: {
  credentialSubject: S | S[]
  type: string[]
  privateKey: Buffer
  issuanceDate: string
  expirationDate?: string
  revocation: R
  context?: string | string[]
}): Promise<AtomicVCV1> => {
  const issuer = EthWallet.fromPrivateKey(privateKey)
  const {didDocument: issuerDidDoc} = await new EthUtils.EthereumDIDResolver().resolve(`did:ethr:${issuer.getAddressString()}`)
  const publicKey = issuerDidDoc.publicKey[0]

  const context = ['https://www.w3.org/2018/credentials/v1']

  if (Array.isArray(_context)) {
    context.concat(_context)
  } else if (typeof _context === 'string') {
    context.push(_context)
  }

  const unsignedCred: Omit<AtomicVCV1, 'proof'> = {
    '@context': context,
    type: ['VerifiableCredential', ...type],
    issuer: `did:ethr:${issuer.getAddressString()}`,
    issuanceDate,
    expirationDate,
    credentialSubject,
    revocation,
  }

  console.log({publicKey: issuer.getAddressString()})
  const privateKeyJwk = await keyUtils.privateJWKFromPrivateKeyHex(issuer.getPrivateKeyString().replace('0x', ''))

  console.log({privateKeyJwk})

  const credential: AtomicVCV1 = await jsigs.sign(unsignedCred, {
    suite: new EcdsaSecp256k1Signature2019({
      key: new EcdsaSecp256k1KeyClass2019({
        id: publicKey.id,
        controller: publicKey.controller,
        privateKeyJwk,
      }),
    }),
    documentLoader: EthUtils.documentLoader,
    purpose: new AssertionProofPurpose(),
    compactProof: false,
    expansionMap: false, // TODO: remove this
  })

  console.log({credential})

  return credential
}
