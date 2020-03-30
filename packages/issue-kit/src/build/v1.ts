import {
  EthUtils,
  DIDUtils,
  VCV1,
  VCV1Subject,
  VCV1Type,
  BaseVCV1Revocation,
  SimpleThing,
  TContext,
  VCV1Holder,
} from '@bloomprotocol/vc-common'
import {EcdsaSecp256k1Signature2019, EcdsaSecp256k1KeyClass2019} from '@transmute/lds-ecdsa-secp256k1-2019'
import {keyUtils} from '@transmute/es256k-jws-ts'

const jsigs = require('jsonld-signatures')
const {AssertionProofPurpose} = jsigs.purposes

export const buildVCV1Subject = async <Data extends SimpleThing>({
  data,
  subject,
}: {
  data: Data
  subject?: string
}): Promise<VCV1Subject<Data>> => {
  if (subject) {
    // Here to validate the subject's DID
    await DIDUtils.resolveDID(subject)
  }

  if (data.hasOwnProperty('id')) throw Error("Data must not contain an 'id' property, that is assigned to the subject's DID")

  const credentialSubject: VCV1Subject<Data> = {
    id: subject,
    data,
  }

  return credentialSubject
}

export type Issuer = {
  did: string
  keyId: string
  publicKey: string
  privateKey: string
}

export const genRevocation = (): BaseVCV1Revocation => {
  return {id: EthUtils.generateRandomHex(64)}
}

export const buildVCV1 = async <S extends VCV1Subject<{'@type': string}>, R extends BaseVCV1Revocation>(opts: {
  id: string
  credentialSubject: S | S[]
  holder: VCV1Holder
  type: string | string[]
  issuer: Issuer
  issuanceDate: string
  expirationDate?: string
  revocation?: R
  context?: TContext
}): Promise<VCV1> => {
  const issuerDidDoc = await DIDUtils.resolveDID(opts.issuer.did)

  const publicKey = issuerDidDoc.publicKey.find(x => x.id.endsWith(opts.issuer.keyId) && x.publicKeyHex === opts.issuer.publicKey)

  if (!publicKey) throw new Error('No key found for provided keyId and publicKey')

  const context = [
    'https://www.w3.org/2018/credentials/v1',
    ...(Array.isArray(opts.context) ? opts.context : typeof opts.context === 'undefined' ? [] : [opts.context]),
  ]
  const type: VCV1Type = ['VerifiableCredential', ...(Array.isArray(opts.type) ? opts.type : [opts.type])]

  const unsignedCred: Omit<VCV1, 'proof'> = {
    '@context': context,
    id: opts.id,
    type,
    issuer: opts.issuer.did,
    holder: opts.holder,
    issuanceDate: opts.issuanceDate,
    expirationDate: opts.expirationDate,
    credentialSubject: opts.credentialSubject,
    revocation: opts.revocation || genRevocation(),
  }

  console.log('buildVCV1', {publicKey})

  const credential: VCV1 = await jsigs.sign(unsignedCred, {
    suite: new EcdsaSecp256k1Signature2019({
      key: new EcdsaSecp256k1KeyClass2019({
        id: publicKey.id,
        controller: opts.issuer.did,
        privateKeyJwk: await keyUtils.privateJWKFromPrivateKeyHex(
          opts.issuer.privateKey.startsWith('0x') ? opts.issuer.privateKey.substring(2) : opts.issuer.privateKey,
        ),
      }),
    }),
    documentLoader: DIDUtils.documentLoader,
    purpose: new AssertionProofPurpose(),
    compactProof: false,
    expansionMap: false, // TODO: remove this
  })

  return credential
}
