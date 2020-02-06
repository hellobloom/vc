import {
  genValidateFn,
  genAsyncValidateFn,
  Utils,
  EthUtils,
  VPV1,
  VPProofV1,
  AtomicVCV1,
  AtomicVCSubjectV1,
  AtomicVCProofV1,
  BaseVCRevocationV1,
  ValidateFn,
} from '@bloomprotocol/attestations-common'
import {keyUtils} from '@transmute/es256k-jws-ts'
import {EcdsaSecp256k1KeyClass2019, EcdsaSecp256k1Signature2019, defaultDocumentLoader} from '@transmute/lds-ecdsa-secp256k1-2019'

const jsigs = require('jsonld-signatures')
const {AuthenticationProofPurpose, AssertionProofPurpose} = jsigs.purposes

const stripOwnerFromDID = (value: string) => value.substr(0, value.length - 6)

const isValidDIDOwner = (value: any) => {
  if (typeof value !== 'string') return false

  return EthUtils.isValidDID(stripOwnerFromDID(value))
}

export const validateCredentialSubject = genValidateFn<AtomicVCSubjectV1>({
  '@type': Utils.isNotEmptyString,
  identifier: EthUtils.isValidDID,
})

const isValidOrArrayOf = <T>(validateFn: ValidateFn<T>) => (data: any): data is T => {
  if (Array.isArray(data)) {
    return data.every(Utils.isValid(validateFn))
  } else {
    return Utils.isValid(validateFn)(data)
  }
}

const validateCredentialRevocation = genValidateFn<BaseVCRevocationV1>({
  '@context': Utils.isNotEmptyString,
})

const validateCredentialProof = genValidateFn<AtomicVCProofV1>({
  type: Utils.isNotEmptyString,
  created: Utils.isValidRFC3339DateTime,
  proofPurpose: (value: any) => value === 'assertionMethod',
  verificationMethod: isValidDIDOwner,
  jws: Utils.isNotEmptyString,
})

const isCredentialProofValid = async (value: any, data: any) => {
  try {
    const {didDocument} = await new EthUtils.EthereumDIDResolver().resolve(stripOwnerFromDID(value.verificationMethod))
    const publicKey = didDocument.publicKey[0]

    const publicKeyJwk = await keyUtils.publicJWKFromPublicKeyHex(publicKey.controller.replace('did:ethr:', ''))

    console.log({publicKeyJwk})

    const res = await jsigs.verify(data, {
      suite: new EcdsaSecp256k1Signature2019({
        key: new EcdsaSecp256k1KeyClass2019({
          id: publicKey.id,
          controller: publicKey.controller,
          publicKeyJwk,
        }),
      }),
      compactProof: false,
      documentLoader: defaultDocumentLoader,
      purpose: new AssertionProofPurpose(),
      expansionMap: false, // TODO: remove this
    })

    console.log({credRes: res})

    // return res.verified === true
    return true
  } catch {
    return false
  }
}

export const validateVerifiableCredential = genAsyncValidateFn<AtomicVCV1>({
  '@context': Utils.isArrayOfNonEmptyStrings,
  id: Utils.isUndefinedOr(Utils.isNotEmptyString),
  type: [Utils.isArrayOfNonEmptyStrings, (value: any) => value[0] === 'VerifiableCredential'],
  issuer: EthUtils.isValidDID,
  issuanceDate: Utils.isValidRFC3339DateTime,
  expirationDate: Utils.isUndefinedOr(Utils.isValidRFC3339DateTime),
  credentialSubject: [
    isValidOrArrayOf(validateCredentialSubject),
    // TODO: validate rest of credentialSubject based on the `type` array
  ],
  revocation: Utils.isValid(validateCredentialRevocation),
  proof: [Utils.isValid(validateCredentialProof), isCredentialProofValid],
})

const validateProof = genValidateFn<VPProofV1>({
  type: Utils.isNotEmptyString,
  created: Utils.isValidRFC3339DateTime,
  proofPurpose: (value: any) => value === 'authentication',
  verificationMethod: isValidDIDOwner,
  challenge: Utils.isNotEmptyString,
  domain: Utils.isNotEmptyString,
  jws: Utils.isNotEmptyString,
})

const isPresentationProofValid = async (value: any, data: any) => {
  try {
    const {didDocument} = await new EthUtils.EthereumDIDResolver().resolve(stripOwnerFromDID(value.verificationMethod))
    const publicKey = didDocument.publicKey[0]

    const res = await jsigs.verify(data, {
      suite: new EcdsaSecp256k1Signature2019({
        key: new EcdsaSecp256k1KeyClass2019({
          id: publicKey.id,
          controller: publicKey.controller,
          publicKeyJwk: await keyUtils.publicJWKFromPublicKeyHex(publicKey.controller.replace('did:ethr:', '')),
        }),
      }),
      documentLoader: defaultDocumentLoader,
      purpose: new AuthenticationProofPurpose({
        // TODO: controller field?
        challenge: data.proof.challenge,
        domain: data.proof.domain,
      }),
      compactProof: false,
      expansionMap: false, // TODO: remove this
    })

    console.log({presRes: res})

    // TODO: return res.verified === true
    return true
  } catch {
    return false
  }
}

export const validateVerifiablePresentationV1 = genAsyncValidateFn<VPV1<AtomicVCV1>>({
  '@context': Utils.isArrayOfNonEmptyStrings,
  type: [Utils.isArrayOfNonEmptyStrings, (value: any) => value[0] === 'VerifiablePresentation'],
  verifiableCredential: Utils.isAsyncArrayOf(Utils.isAsyncValid(validateVerifiableCredential)),
  holder: [EthUtils.isValidDID],
  proof: [Utils.isValid(validateProof), isPresentationProofValid],
})
