import {genValidateFn, Utils, EthUtils, IVerifiableAuth} from '@bloomprotocol/attestations-common'
import * as EthU from 'ethereumjs-util'
import {keccak256} from 'js-sha3'

export const validateAuthSignature = (value: any, data: any) => {
  const creator = data?.proof?.creator
  if (typeof creator !== 'string') return false
  const recoveredSigner = EthUtils.recoverHashSigner(EthU.toBuffer('0x' + keccak256(Utils.orderedStringify(data.proof))), value)
  return recoveredSigner.toLowerCase() === creator.toLowerCase()
}

export const validateAuthProof = genValidateFn({
  type: Utils.isNotEmptyString,
  created: Utils.isValidRFC3339DateTime,
  creator: EthU.isValidAddress,
  nonce: Utils.isNotEmptyString,
  domain: Utils.isNotEmptyString,
})

export const validateVerifiableAuth = genValidateFn<IVerifiableAuth>({
  context: Utils.isArrayOfNonEmptyStrings,
  type: (value: any) => value === 'VerifiableAuth',
  proof: (value: any) => validateAuthProof(value).kind === 'validated',
  signature: [EthUtils.isValidSignatureString, validateAuthSignature],
})
