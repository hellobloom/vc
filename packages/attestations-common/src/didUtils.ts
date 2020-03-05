import base64url from 'base64url'
import {Resolver, DIDDocument, ParsedDID} from 'did-resolver'
const jsonld = require('jsonld')

type EnhancedDIDDocument = DIDDocument & {
  assertionMethod: []
}

const resolveElemDID = async (_: string, parsed: ParsedDID): Promise<EnhancedDIDDocument | null> => {
  if (!parsed.params) return null
  const initialState = parsed.params['elem:initial-state']
  if (!initialState) return null

  const decodedInitialState = JSON.parse(base64url.decode(initialState))
  const decodedPayload = JSON.parse(base64url.decode(decodedInitialState.payload))
  // TODO: validate payload with signautes

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

export const resolveDID = async (did: string): Promise<EnhancedDIDDocument> => {
  if (!isValidDIDStructure(did)) {
    throw Error(`unable to resolve did document: ${did}`)
  }

  const resolver = new Resolver({elem: resolveElemDID})
  const didDocument = (await resolver.resolve(did)) as EnhancedDIDDocument

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
