import base64url from 'base64url'
import {binToHex, hexToBin, instantiateSecp256k1, RecoveryId} from 'bitcoin-ts'
import crypto from 'crypto'
import {keyUtils} from '@transmute/es256k-jws-ts'
import {ISecp256k1PrivateKeyJWK} from '@transmute/es256k-jws-ts/dist/types/keyUtils'

class JWSVerificationFailed extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'JWSVerificationFailed'
  }
}

export const signDetached = async (
  // in the case of EcdsaSecp256k1Signature2019 this is the result of createVerifyData
  payload: Buffer,
  privateKeyJWK: ISecp256k1PrivateKeyJWK,
  header = {
    alg: 'ES256K',
    b64: false,
    crit: ['b64'],
  },
) => {
  const privateKeyUInt8Array = await keyUtils.privateKeyUInt8ArrayFromJWK(privateKeyJWK)
  const secp256k1 = await instantiateSecp256k1()
  const encodedHeader = base64url.encode(JSON.stringify(header))

  const toBeSignedBuffer = Buffer.concat([
    Buffer.from(encodedHeader + '.', 'utf8'),
    Buffer.from(payload.buffer, payload.byteOffset, payload.length),
  ])

  const message = Buffer.from(toBeSignedBuffer)

  const digest = crypto
    .createHash('sha256')
    .update(message)
    .digest()
    .toString('hex')

  const messageHashUInt8Array = hexToBin(digest)

  const {signature, recoveryId} = secp256k1.signMessageHashRecoverableCompact(privateKeyUInt8Array, messageHashUInt8Array)

  const signatureHex = binToHex(signature)
  const encodedSignature = base64url.encode(Buffer.from(signatureHex, 'hex'))

  return {jws: `${encodedHeader}..${encodedSignature}`, recoveryId}
}

/** Verify a JWS Unencoded Payload per https://tools.ietf.org/html/rfc7797#section-6 */
export const verifyDetached = async (jws: string, payload: Buffer, recoveryId: RecoveryId) => {
  if (jws.indexOf('..') === -1) {
    throw new JWSVerificationFailed('not a valid rfc7797 jws.')
  }
  const [encodedHeader, encodedSignature] = jws.split('..')
  const header = JSON.parse(base64url.decode(encodedHeader))
  if (header.alg !== 'ES256K') {
    throw new Error('JWS alg is not signed with ES256K.')
  }
  if (header.b64 !== false || !header.crit || !header.crit.length || header.crit[0] !== 'b64') {
    throw new Error('JWS Header is not in rfc7797 format (not detached).')
  }

  const secp256k1 = await instantiateSecp256k1()
  const toBeSignedBuffer = Buffer.concat([
    Buffer.from(encodedHeader + '.', 'utf8'),
    Buffer.from(payload.buffer, payload.byteOffset, payload.length),
  ])
  const message = Buffer.from(toBeSignedBuffer)
  const digest = crypto
    .createHash('sha256')
    .update(message)
    .digest()
    .toString('hex')
  const messageHashUInt8Array = hexToBin(digest)
  const signatureUInt8Array = hexToBin(base64url.toBuffer(encodedSignature).toString('hex'))
  const publicKeyUInt8Array = secp256k1.recoverPublicKeyUncompressed(signatureUInt8Array, recoveryId, messageHashUInt8Array)
  const verified = secp256k1.verifySignatureCompact(signatureUInt8Array, publicKeyUInt8Array, messageHashUInt8Array)
  if (verified) {
    return binToHex(publicKeyUInt8Array)
  }
  throw new Error('Cannot verify detached signature.')
}
