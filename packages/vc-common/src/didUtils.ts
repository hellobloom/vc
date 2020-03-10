import base64url from 'base64url'
import {Resolver, DIDDocument as _DIDDocument, ParsedDID, PublicKey} from 'did-resolver'

const jsonld = require('jsonld')
const {op, func} = require('@transmute/element-lib')

type DIDDocument = _DIDDocument & {
  assertionMethod: []
}

type KeyPair = {
  publicKey: string
  privateKey: string
}

export const createElemDID = async ({
  primaryKey,
  recoveryKey,
}: {
  primaryKey: KeyPair
  recoveryKey: Omit<KeyPair, 'privateKey'>
}): Promise<string> => {
  const didDocumentModel = {
    ...op.getDidDocumentModel(primaryKey.publicKey, recoveryKey.publicKey),
    '@context': 'https://w3id.org/security/v2',
    authentication: ['#primary'],
    assertionMethod: ['#primary'],
  }
  const createPayload = await op.getCreatePayload(didDocumentModel, {privateKey: primaryKey.privateKey})
  const didUniqueSuffix = func.getDidUniqueSuffix(createPayload)

  return `did:elem:${didUniqueSuffix};elem:initial-state=${base64url.encode(JSON.stringify(createPayload))}`
}

const resolveElemDID = async (_: string, parsed: ParsedDID): Promise<DIDDocument | null> => {
  if (!parsed.params) throw new Error('Element DID must have the elem:intial-state matrix param')
  const initialState = parsed.params['elem:initial-state']
  if (!initialState) throw new Error('Element DID must have the elem:intial-state matrix param')

  const {protected: encodedHeader, payload: encodedPayload, signature} = JSON.parse(base64url.decode(initialState))

  const decodedHeader = JSON.parse(base64url.decode(encodedHeader))
  const decodedPayload = JSON.parse(base64url.decode(encodedPayload))
  const publicKey = decodedPayload.publicKey.find(({id}: PublicKey) => id === decodedHeader.kid)

  if (!publicKey) throw new Error(`Cannot find public key with id: ${decodedHeader.kid}`)

  const isSigValid = func.verifyOperationSignature(encodedHeader, encodedPayload, signature, publicKey.publicKeyHex)

  if (!isSigValid) throw new Error('Cannot validate create operation')

  const prependBaseDID = (field: any) => {
    if (typeof field === 'string') {
      return field.startsWith('#') ? `${parsed.didUrl}${field}` : field
    } else if (typeof field === 'object' && field.hasOwnProperty('id') && typeof field.id === 'string') {
      return {
        ...field,
        id: field.id.startsWith('#') ? `${parsed.didUrl}${field.id}` : field.id,
      }
    } else {
      throw new Error('Unsupported method format')
    }
  }

  const mappedPayload = {
    ...decodedPayload,
    publicKey: (decodedPayload.publicKey || []).map(prependBaseDID),
    assertionMethod: (decodedPayload.assertionMethod || []).map(prependBaseDID),
    authentication: (decodedPayload.authentication || []).map(prependBaseDID),
  }

  return {
    ...mappedPayload,
    id: parsed.didUrl,
  }
}

const isValidElemDIDStructure = (value: string) => value.startsWith('did:elem:') && value.indexOf(';elem:initial-state=') >= 0

export const isValidDIDStructure = (value: any): value is string => {
  if (typeof value !== 'string') return false
  if (!value.startsWith('did:')) return false

  if (value.startsWith('did:elem:')) {
    return isValidElemDIDStructure(value)
  }

  return false
}

export const resolveDID = async (did: string): Promise<DIDDocument> => {
  if (!isValidDIDStructure(did)) {
    throw Error(`unable to resolve did document: ${did}`)
  }

  const resolver = new Resolver({elem: resolveElemDID})
  const didDocument = (await resolver.resolve(did)) as DIDDocument

  if (!didDocument) {
    throw Error(`unable to resolve did document: ${did}`)
  }

  return didDocument
}

const _documentLoader = (() => {
  const nodejs = typeof process !== 'undefined' && process.versions && process.versions.node
  const browser = !nodejs && (typeof window !== 'undefined' || typeof self !== 'undefined')

  return browser ? jsonld.documentLoaders.xhr() : jsonld.documentLoaders.node()
})()

export const documentLoader = async (url: string): Promise<any> => {
  if (url.startsWith('did:')) {
    const didDocument = await resolveDID(url)

    return {
      contextUrl: null,
      document: didDocument,
      documentUrl: url,
    }
  }

  return _documentLoader(url)
}
