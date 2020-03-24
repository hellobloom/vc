import {
  genValidateFn,
  genAsyncValidateFn,
  Utils,
  DIDUtils,
  BaseVPV1,
  BaseVPV1Proof,
  VCV1,
  VCV1Subject,
  VCV1Proof,
  BaseVCV1Revocation,
  ValidateFn,
} from '@bloomprotocol/vc-common'
import {EcdsaSecp256k1Signature2019, EcdsaSecp256k1KeyClass2019} from '@transmute/lds-ecdsa-secp256k1-2019'
import {keyUtils} from '@transmute/es256k-jws-ts'

const jsigs = require('jsonld-signatures')
const {AssertionProofPurpose, AuthenticationProofPurpose} = jsigs.purposes

const validateCredentialSubjectData = genValidateFn<VCV1Subject<any>['data']>({
  '@type': Utils.isNotEmptyString,
})

export const validateCredentialSubject = genValidateFn<VCV1Subject<any>>({
  id: DIDUtils.isValidDIDStructure,
  data: Utils.isValid(validateCredentialSubjectData),
})

const isValidOrArrayOf = <T>(validateFn: ValidateFn<T>) => (data: any): data is T => {
  if (Array.isArray(data)) {
    return data.every(Utils.isValid(validateFn))
  } else {
    return Utils.isValid(validateFn)(data)
  }
}

export const validateCredentialRevocation = genValidateFn<BaseVCV1Revocation>({
  id: Utils.isNotEmptyString,
})

export const validateCredentialProof = genValidateFn<VCV1Proof>({
  type: Utils.isNotEmptyString,
  created: Utils.isValidRFC3339DateTime,
  proofPurpose: (value: any) => value === 'assertionMethod',
  verificationMethod: Utils.isNotEmptyString,
  jws: Utils.isNotEmptyString,
})

const isCredentialProofValid = async (_: any, data: any) => {
  try {
    const didDocument = await DIDUtils.resolveDID(data.issuer)
    const publicKey = didDocument.publicKey.find(({id}) => id.endsWith('#primary'))

    if (!publicKey) return false

    const res = await jsigs.verify(data, {
      suite: new EcdsaSecp256k1Signature2019({
        key: new EcdsaSecp256k1KeyClass2019({
          id: publicKey.id,
          controller: data.issuer,
          publicKeyJwk: await keyUtils.publicJWKFromPublicKeyHex(publicKey.publicKeyHex!),
        }),
      }),
      compactProof: false,
      documentLoader: DIDUtils.documentLoader,
      purpose: new AssertionProofPurpose(),
      expansionMap: false, // TODO: remove this
    })

    return res.verified === true
  } catch {
    return false
  }
}

const isValidContext = (value: any) => {
  const normalizedValue = Array.isArray(value) ? value : [value]

  return normalizedValue.every(context => {
    if (typeof context === 'string') return true
    if (typeof context === 'object') return true

    return false
  })
}

export const validateVerifiableCredential = genAsyncValidateFn<VCV1>({
  '@context': isValidContext,
  id: Utils.isUndefinedOr(Utils.isNotEmptyString),
  type: [Utils.isArrayOfNonEmptyStrings, (value: string[]) => value.includes('VerifiableCredential')],
  issuer: DIDUtils.isValidDIDStructure,
  issuanceDate: Utils.isValidRFC3339DateTime,
  expirationDate: Utils.isUndefinedOr(Utils.isValidRFC3339DateTime),
  credentialSubject: [
    isValidOrArrayOf(validateCredentialSubject),
    // TODO: validate rest of credentialSubject based on the `type` array
  ],
  revocation: Utils.isValid(validateCredentialRevocation),
  proof: [Utils.isValid(validateCredentialProof), isCredentialProofValid],
})

const isValidVerifiableCredential = async (value: any, data: any) => {
  // TODO: Does the holder check even make sense?
  const anySubjectsMatchHolder = (Array.isArray(value.credentialSubject) ? value.credentialSubject : [value.credentialSubject]).some(
    ({id}: {id: string}) => id === data.holder,
  )

  return anySubjectsMatchHolder && (await Utils.isAsyncValid(validateVerifiableCredential)(value))
}

export const validateProof = genValidateFn<BaseVPV1Proof>({
  type: Utils.isNotEmptyString,
  created: Utils.isValidRFC3339DateTime,
  proofPurpose: (value: any) => value === 'authentication',
  verificationMethod: Utils.isNotEmptyString,
  challenge: Utils.isNotEmptyString,
  domain: Utils.isNotEmptyString,
  jws: Utils.isNotEmptyString,
})

export const isPresentationProofValid = async (_: any, data: any) => {
  try {
    const didDocument = await DIDUtils.resolveDID(data.holder)
    const publicKey = didDocument.publicKey.find(({id}) => id.endsWith('#primary'))

    if (!publicKey) return false

    const res = await jsigs.verify(data, {
      suite: new EcdsaSecp256k1Signature2019({
        key: new EcdsaSecp256k1KeyClass2019({
          id: publicKey.id,
          controller: data.holder,
          publicKeyJwk: await keyUtils.publicJWKFromPublicKeyHex(publicKey.publicKeyHex!),
        }),
      }),
      documentLoader: DIDUtils.documentLoader,
      purpose: new AuthenticationProofPurpose({
        challenge: data.proof.challenge,
        domain: data.proof.domain,
      }),
      compactProof: false,
      expansionMap: false, // TODO: remove this
    })

    return res.verified === true
  } catch {
    return false
  }
}

export const validateVerifiablePresentationV1 = genAsyncValidateFn<BaseVPV1<VCV1>>({
  '@context': isValidContext,
  type: [Utils.isArrayOfNonEmptyStrings, (value: string[]) => value.includes('VerifiablePresentation')],
  verifiableCredential: Utils.isAsyncArrayOf(isValidVerifiableCredential),
  holder: [DIDUtils.isValidDIDStructure],
  proof: [Utils.isValid(validateProof), isPresentationProofValid],
})
