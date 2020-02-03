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
} from '@bloomprotocol/attestations-common'

const {EcdsaSecp256k1KeyClass2019, EcdsaSecp256k1Signature2019, defaultDocumentLoader} = require('@transmute/lds-ecdsa-secp256k1-2019')
const keyto = require('@trust/keyto')
const jsigs = require('jsonld-signatures')
const {AuthenticationProofPurpose, AssertionProofPurpose} = jsigs.purposes

export const validateCredentialSubject = genValidateFn<AtomicVCSubjectV1>({
  id: EthUtils.isValidDID,
})

const validateCredentialProof = genValidateFn<AtomicVCProofV1>({
  type: Utils.isNotEmptyString,
  created: Utils.isValidRFC3339DateTime,
  proofPurpose: (value: any) => value === 'assertionMethod',
  verificationMethod: EthUtils.isValidDID,
  jws: Utils.isNotEmptyString,
})

const isCredentialProofValid = async (value: any, data: any) => {
  try {
    const {didDocument} = await new EthUtils.EthereumDIDResolver().resolve(value.verificationMethod)
    const publicKey = didDocument.publicKey[0]

    const key = new EcdsaSecp256k1KeyClass2019({
      id: publicKey.id,
      controller: publicKey.controller,
      publicKeyJwk: keyto.from(publicKey.controller.replace('did:ethr:', ''), 'blk').toJwk('public'),
    })

    const res = await jsigs.verify(data, {
      suite: new EcdsaSecp256k1Signature2019({key}),
      documentLoader: defaultDocumentLoader,
      purpose: new AssertionProofPurpose(),
      expansionMap: false, // TODO: remove this
    })

    return res.verified === true
  } catch {
    return false
  }
}

export const validateVerifiableCredential = genAsyncValidateFn<AtomicVCV1>({
  '@context': Utils.isArrayOfNonEmptyStrings,
  id: Utils.isUndefinedOr(Utils.isNotEmptyString),
  type: [Utils.isArrayOfNonEmptyStrings, (value: any) => value[0] === 'VerifiableCredential' && value[1] === 'AtomicCredential'],
  issuer: EthUtils.isValidDID,
  issuanceDate: Utils.isValidRFC3339DateTime,
  expirationDate: Utils.isUndefinedOr(Utils.isValidRFC3339DateTime),
  credentialSubject: [
    Utils.isValid(validateCredentialSubject),
    // TODO: validate rest of credentialSubject based on the `type` array
  ],
  proof: [Utils.isValid(validateCredentialProof), isCredentialProofValid],
})

const validateProof = genValidateFn<VPProofV1>({
  type: Utils.isNotEmptyString,
  created: Utils.isValidRFC3339DateTime,
  proofPurpose: (value: any) => value === 'authentication',
  verificationMethod: EthUtils.isValidDID,
  challenge: Utils.isNotEmptyString,
  domain: Utils.isNotEmptyString,
  jws: Utils.isNotEmptyString,
})

const isPresentationProofValid = async (value: any, data: any) => {
  try {
    const {didDocument} = await new EthUtils.EthereumDIDResolver().resolve(value.verificationMethod)
    const publicKey = didDocument.publicKey[0]

    const key = new EcdsaSecp256k1KeyClass2019({
      id: publicKey.id,
      controller: publicKey.controller,
      publicKeyJwk: keyto.from(publicKey.controller.replace('did:ethr:', ''), 'blk').toJwk('public'),
    })

    const res = await jsigs.verify(data, {
      suite: new EcdsaSecp256k1Signature2019({key}),
      documentLoader: defaultDocumentLoader,
      purpose: new AuthenticationProofPurpose({
        // TODO: controller field?
        challenge: data.proof.challenge,
        domain: data.proof.domain,
      }),
      expansionMap: false, // TODO: remove this
    })

    return res.verified === true
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
