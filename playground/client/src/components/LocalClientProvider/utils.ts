import {EthUtils, VPV1, VPProofV1, AtomicVCV1} from '@bloomprotocol/attestations-common'
import EthWallet from 'ethereumjs-wallet'
import extend from 'extend'

const {EcdsaSecp256k1KeyClass2019, EcdsaSecp256k1Signature2019, defaultDocumentLoader} = require('@transmute/lds-ecdsa-secp256k1-2019')
const keyto = require('@trust/keyto')
const jsigs = require('jsonld-signatures')
const url = require('url')

const {AuthenticationProofPurpose} = jsigs.purposes

export const buildVPV1 = async ({
  wallet,
  atomicVCs,
  token,
  domain,
}: {
  atomicVCs: AtomicVCV1[]
  token: string
  domain: string
  wallet: EthWallet
}): Promise<VPV1> => {
  const unsignedVP: Omit<VPV1<AtomicVCV1>, 'proof'> = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiablePresentation'],
    verifiableCredential: atomicVCs,
    holder: `did:ethr:${wallet.getAddressString()}`,
  }

  const {didDocument} = await new EthUtils.EthereumDIDResolver().resolve(`did:ethr:${wallet.getAddressString()}`)

  const vp: VPV1<AtomicVCV1> = jsigs.sign(unsignedVP, {
    suite: new EcdsaSecp256k1Signature2019({
      key: new EcdsaSecp256k1KeyClass2019({
        id: didDocument.publicKey[0].id,
        controller: didDocument.publicKey[0].controller,
        privateKeyJwk: keyto.from(wallet.getPrivateKeyString().replace('0x', ''), 'blk').toJwk('private'),
      }),
    }),
    documentLoader: defaultDocumentLoader,
    purpose: new AuthenticationProofPurpose({
      challenge: token,
      domain: domain,
    }),
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
