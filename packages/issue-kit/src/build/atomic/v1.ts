import {DIDUtils, AtomicVCV1, AtomicVCSubjectV1, BaseVCRevocationSimpleV1, SimpleThing} from '@bloomprotocol/attestations-common'
import {
  RecoverableEcdsaSecp256k1Signature2019,
  RecoverableEcdsaSecp256k1KeyClass2019,
  Purposes,
} from '@bloomprotocol/jsonld-recoverable-es256k'
import EthWallet from 'ethereumjs-wallet'
import {keyUtils} from '@transmute/es256k-jws-ts'

const jsigs = require('jsonld-signatures')
const {RecoverableAssertionProofPurpose} = Purposes

export const buildAtomicVCSubjectV1 = async <Data extends SimpleThing>({
  data,
  subject,
}: {
  data: Data
  subject: string
}): Promise<AtomicVCSubjectV1<Data>> => {
  const subjectDidDoc = await DIDUtils.resolveDID(subject)

  if (data.hasOwnProperty('id')) throw Error("Data must not contain an 'id' property, that is assigned to the subject's DID")

  const credentialSubject: AtomicVCSubjectV1<Data> = {
    id: subjectDidDoc.id,
    data,
  }

  return credentialSubject
}

export const buildAtomicVCV1 = async <S extends AtomicVCSubjectV1<{'@type': string}>, R extends BaseVCRevocationSimpleV1>({
  credentialSubject,
  type,
  issuer,
  keyId,
  privateKey,
  issuanceDate,
  expirationDate,
  revocation,
  context: _context,
}: {
  credentialSubject: S | S[]
  type: string[]
  issuer: string
  keyId: string
  privateKey: Buffer
  issuanceDate: string
  expirationDate?: string
  revocation: R
  context?: string | string[]
}): Promise<AtomicVCV1> => {
  const issuerDidDoc = await DIDUtils.resolveDID(issuer)
  const publicKey = issuerDidDoc.publicKey.find(({id}) => id === keyId)

  if (!publicKey) throw new Error('Provided key id cannot be found')

  const context = ['https://www.w3.org/2018/credentials/v1']

  if (Array.isArray(_context)) {
    context.concat(_context)
  } else if (typeof _context === 'string') {
    context.push(_context)
  }

  const unsignedCred: Omit<AtomicVCV1, 'proof'> = {
    '@context': context,
    type: ['VerifiableCredential', ...type],
    issuer,
    issuanceDate,
    expirationDate,
    credentialSubject,
    revocation,
  }

  const credential: AtomicVCV1 = await jsigs.sign(unsignedCred, {
    suite: new RecoverableEcdsaSecp256k1Signature2019({
      key: new RecoverableEcdsaSecp256k1KeyClass2019({
        id: publicKey.id,
        controller: publicKey.owner,
        privateKeyJwk: await keyUtils.privateJWKFromPrivateKeyHex(keyUtils.binToHex(privateKey)),
      }),
    }),
    documentLoader: DIDUtils.documentLoader,
    purpose: new RecoverableAssertionProofPurpose({
      addressKey: 'ethereumAddress',
      keyToAddress: key => EthWallet.fromPublicKey(Buffer.from(key.substr(2), 'hex')).getAddressString(),
    }),
    compactProof: false,
    expansionMap: false, // TODO: remove this
  })

  return credential
}
