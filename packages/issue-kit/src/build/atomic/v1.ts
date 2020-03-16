import {
  DIDUtils,
  VCV1,
  VCV1Subject,
  VCV1Type,
  BaseVCV1RevocationSimple,
  SimpleThing,
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
  subject: string
}): Promise<VCV1Subject<Data>> => {
  // Here to validate the subject's DID
  await DIDUtils.resolveDID(subject)

  if (data.hasOwnProperty('id')) throw Error("Data must not contain an 'id' property, that is assigned to the subject's DID")

  const credentialSubject: VCV1Subject<Data> = {
    id: subject,
    data,
  }

  return credentialSubject
}

type Issuer = {
  did: string
  keyId: string
  publicKey: string
  privateKey: string
}

export const buildVCV1 = async <S extends VCV1Subject<{'@type': string}>, R extends BaseVCV1RevocationSimple>({
  credentialSubject,
  type: _type,
  issuer,
  issuanceDate,
  expirationDate,
  revocation,
  context: _context,
}: {
  credentialSubject: S | S[]
  type: string | string[]
  issuer: Issuer
  issuanceDate: string
  expirationDate?: string
  revocation: R
  context?: string | string[]
}): Promise<VCV1> => {
  const issuerDidDoc = await DIDUtils.resolveDID(issuer.did)
  const publicKey = issuerDidDoc.publicKey.find(({id, publicKeyHex}) => id.endsWith(issuer.keyId) && publicKeyHex === issuer.publicKey)

  if (!publicKey) throw new Error('No key found for provided keyId and publicKey')

  const context = [
    'https://www.w3.org/2018/credentials/v1',
    ...(Array.isArray(_context) ? _context : typeof _context === 'undefined' ? [] : [_context]),
  ]
  const type: VCV1Type = ['VerifiableCredential', ...(Array.isArray(_type) ? _type : [_type])]

  const unsignedCred: Omit<VCV1, 'proof'> = {
    '@context': context,
    type,
    issuer: issuer.did,
    issuanceDate,
    expirationDate,
    credentialSubject,
    revocation,
  }

  console.log('buildVCV1', {publicKey})

  const credential: VCV1 = await jsigs.sign(unsignedCred, {
    suite: new EcdsaSecp256k1Signature2019({
      key: new EcdsaSecp256k1KeyClass2019({
        id: publicKey.id,
        controller: issuer.did,
        privateKeyJwk: await keyUtils.privateJWKFromPrivateKeyHex(
          issuer.privateKey.startsWith('0x') ? issuer.privateKey.substring(2) : issuer.privateKey,
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
