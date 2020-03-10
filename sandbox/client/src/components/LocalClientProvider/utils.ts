import {DIDUtils, VPV1, AtomicVCV1} from '@bloomprotocol/vc-common'
import extend from 'extend'
import {keyUtils} from '@transmute/es256k-jws-ts'

const {MnemonicKeySystem} = require('@transmute/element-lib')
const {EcdsaSecp256k1KeyClass2019, EcdsaSecp256k1Signature2019} = require('@transmute/lds-ecdsa-secp256k1-2019')
const jsigs = require('jsonld-signatures')
const url = require('url')

const {AuthenticationProofPurpose} = jsigs.purposes

export const generateElemDID = async () => {
  const menmonic: string = MnemonicKeySystem.generateMnemonic()
  const mks = new MnemonicKeySystem(menmonic)
  const primaryKey = await mks.getKeyForPurpose('primary', 0)
  const recoveryKey = await mks.getKeyForPurpose('recovery', 0)

  const did = await DIDUtils.createElemDID({primaryKey, recoveryKey})

  return {
    did,
    menmonic,
  }
}

type Holder = {
  did: string
  keyId: string
  publicKey: string
  privateKey: string
}

export const buildVPV1 = async ({
  holder,
  atomicVCs,
  token,
  domain,
}: {
  atomicVCs: AtomicVCV1[]
  token: string
  domain: string
  holder: Holder
}): Promise<VPV1> => {
  const issuerDidDoc = await DIDUtils.resolveDID(holder.did)
  const publicKey = issuerDidDoc.publicKey.find(({id, publicKeyHex}) => id.endsWith(holder.keyId) && publicKeyHex === holder.publicKey)

  if (!publicKey) throw new Error('No key found for provided keyId and publicKey')

  const unsignedVP: Omit<VPV1<AtomicVCV1>, 'proof'> = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiablePresentation'],
    verifiableCredential: atomicVCs,
    holder: holder.did,
  }

  const vp: VPV1<AtomicVCV1> = jsigs.sign(unsignedVP, {
    suite: new EcdsaSecp256k1Signature2019({
      key: new EcdsaSecp256k1KeyClass2019({
        id: publicKey.id,
        controller: holder.did,
        privateKeyJwk: await keyUtils.privateJWKFromPrivateKeyHex(
          holder.privateKey.startsWith('0x') ? holder.privateKey.substring(2) : holder.privateKey,
        ),
      }),
    }),
    documentLoader: DIDUtils.documentLoader,
    purpose: new AuthenticationProofPurpose({
      challenge: token,
      domain: domain,
    }),
    compactProof: false,
    expansionMap: false, // TODO: remove this
  })

  return vp
}

export const appendQuery = (uri: string, queryToAppend: {[key: string]: string | null}) => {
  const parts = url.parse(uri, true)
  const parsedQuery = extend(true, {}, parts.query, queryToAppend)

  const queryString = Object.keys(parsedQuery)
    .map(key => {
      const value = parsedQuery[key]
      return value === null ? encodeURIComponent(key) : encodeURIComponent(key) + '=' + encodeURIComponent(value)
    })
    .join('&')

  parts.query = null
  parts.search = queryString ? '?' + queryString : null

  return url.format(parts)
}
