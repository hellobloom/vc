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
import {
  RecoverableEcdsaSecp256k1Signature2019,
  RecoverableEcdsaSecp256k1KeyClass2019,
  Purposes,
} from '@bloomprotocol/jsonld-recoverable-es256k'
import EthWallet from 'ethereumjs-wallet'

const jsigs = require('jsonld-signatures')
const {RecoverableAssertionProofPurpose, RecoverableAuthenticationProofPurpose} = Purposes

const stripOwnerFromDID = (value: string) => value.substr(0, value.length - 6)

const isValidDIDOwner = (value: any) => {
  if (typeof value !== 'string') return false

  return EthUtils.isValidDID(stripOwnerFromDID(value))
}

export const validateCredentialSubject = genValidateFn<AtomicVCSubjectV1>({
  '@type': Utils.isNotEmptyString,
  id: EthUtils.isValidDID,
})

const isValidOrArrayOf = <T>(validateFn: ValidateFn<T>) => (data: any): data is T => {
  if (Array.isArray(data)) {
    return data.every(Utils.isValid(validateFn))
  } else {
    return Utils.isValid(validateFn)(data)
  }
}

export const validateCredentialRevocation = genValidateFn<BaseVCRevocationV1>({
  '@context': Utils.isNotEmptyString,
})

export const validateCredentialProof = genValidateFn<AtomicVCProofV1>({
  type: Utils.isNotEmptyString,
  created: Utils.isValidRFC3339DateTime,
  proofPurpose: (value: any) => value === 'assertionMethod',
  verificationMethod: isValidDIDOwner,
  jws: Utils.isNotEmptyString,
})

const isCredentialProofValid = async (value: any, data: any) => {
  try {
    const {didDocument} = await EthUtils.resolveDID(stripOwnerFromDID(value.verificationMethod))
    const publicKey = didDocument.publicKey[0]

    const res = await jsigs.verify(data, {
      suite: new RecoverableEcdsaSecp256k1Signature2019({
        key: new RecoverableEcdsaSecp256k1KeyClass2019({
          id: publicKey.id,
          controller: publicKey.controller,
        }),
      }),
      compactProof: false,
      documentLoader: EthUtils.documentLoader,
      purpose: new RecoverableAssertionProofPurpose({
        addressKey: 'ethereumAddress',
        keyToAddress: key => EthWallet.fromPublicKey(Buffer.from(key.substr(2), 'hex')).getAddressString(),
      }),
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
  type: [Utils.isArrayOfNonEmptyStrings, (value: string[]) => value.includes('VerifiableCredential')],
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

const isValidVerifiableCredential = async (value: any, data: any) => {
  if (value.credentialSubject.id !== data.holder) return false

  return await Utils.isAsyncValid(validateVerifiableCredential)(value)
}

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
  // return true

  try {
    const {didDocument} = await EthUtils.resolveDID(stripOwnerFromDID(value.verificationMethod))
    const publicKey = didDocument.publicKey[0]

    const res = await jsigs.verify(data, {
      suite: new RecoverableEcdsaSecp256k1Signature2019({
        key: new RecoverableEcdsaSecp256k1KeyClass2019({
          id: publicKey.id,
          controller: publicKey.controller,
        }),
      }),
      documentLoader: EthUtils.documentLoader,
      purpose: new RecoverableAuthenticationProofPurpose({
        addressKey: 'ethereumAddress',
        keyToAddress: key => EthWallet.fromPublicKey(Buffer.from(key.substr(2), 'hex')).getAddressString(),
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

export const validateVerifiablePresentationV1 = genAsyncValidateFn<VPV1<AtomicVCV1>>({
  '@context': Utils.isArrayOfNonEmptyStrings,
  type: [Utils.isArrayOfNonEmptyStrings, (value: string[]) => value.includes('VerifiablePresentation')],
  verifiableCredential: Utils.isAsyncArrayOf(isValidVerifiableCredential),
  holder: [EthUtils.isValidDID],
  proof: [Utils.isValid(validateProof), isPresentationProofValid],
})
