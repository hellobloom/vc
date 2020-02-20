import base64url from 'base64url'

import {RecoverableEcdsaSecp256k1KeyClass2019} from '../src/RecoverableEcdsaSecp256k1KeyClass2019'

const data = new Uint8Array([128])
let key: RecoverableEcdsaSecp256k1KeyClass2019
const privateKeyJwk = {
  crv: 'secp256k1',
  x: '4xAbUxbGGFPv4qpHlPFAUJdzteUGR1lRK-CELCufU9w',
  y: 'EYcgCTsff1qtZjI9_ckZTXDSKAIuM0BknrKgo0BZ_Is',
  d: 'JCvMpuoQ4CJ_-1mSFtG6gIeqXoS-9joKOon1_DmP6JY',
  kty: 'EC',
  kid: 'WqzaOweASs78whhl_YvCEvj1nd89IycryVlmZMefcjU',
}
const publicKeyJwk = {
  crv: 'secp256k1',
  x: '4xAbUxbGGFPv4qpHlPFAUJdzteUGR1lRK-CELCufU9w',
  y: 'EYcgCTsff1qtZjI9_ckZTXDSKAIuM0BknrKgo0BZ_Is',
  kty: 'EC',
  kid: 'WqzaOweASs78whhl_YvCEvj1nd89IycryVlmZMefcjU',
}

describe('RecoverableEcdsaSecp256k1KeyClass2019', () => {
  it('can import a jwk', async () => {
    key = new RecoverableEcdsaSecp256k1KeyClass2019({
      controller: 'did:example:123',
      privateKeyJwk: privateKeyJwk,
    })
    expect(key.id).toBe('did:example:123#WqzaOweASs78whhl_YvCEvj1nd89IycryVlmZMefcjU')
    expect(key.type).toBe('RecoverableEcdsaSecp256k1VerificationKey2019')
    expect(key.controller).toBe('did:example:123')
    expect(key.privateKeyJwk).toBeDefined()
    expect(key.publicKeyJwk).toBeDefined()
  })

  it('sign', async () => {
    const {sign} = key.signer()
    expect(typeof sign).toBe('function')
    const {jws, recoveryId} = await sign({data})
    const [encodedHeader, encodedSignature] = jws.split('..')
    const header = JSON.parse(base64url.decode(encodedHeader))
    expect(header.b64).toBe(false)
    expect(header.crit).toEqual(['b64'])
    // Note: only works with deterministic K.
    expect(encodedSignature).toBe('hi293ia5YYznl0mS9_-Z0wHoFcSuo3qaWVVJwEXtwn0olNhSi95nx9RIJbsAcUNMmLc4ISih7HxyUs9pXyzcrw')
    expect(recoveryId).toBe(1)
  })

  it('verify', async () => {
    const {verify} = key.verifier()
    expect(typeof verify).toBe('function')
    const signature =
      'eyJhbGciOiJFUzI1NksiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..hi293ia5YYznl0mS9_-Z0wHoFcSuo3qaWVVJwEXtwn0olNhSi95nx9RIJbsAcUNMmLc4ISih7HxyUs9pXyzcrw'
    const result = await verify({data, signature, recoveryId: 1})
    expect(result).toBe(
      '04e3101b5316c61853efe2aa4794f140509773b5e5064759512be0842c2b9f53dc118720093b1f7f5aad66323dfdc9194d70d228022e3340649eb2a0a34059fc8b',
    )
  })

  it('can not sign with out a private key', async () => {
    expect.assertions(6)
    key = new RecoverableEcdsaSecp256k1KeyClass2019({
      controller: 'did:example:123',
      publicKeyJwk: publicKeyJwk,
    })
    expect(key.id).toBe('did:example:123#WqzaOweASs78whhl_YvCEvj1nd89IycryVlmZMefcjU')
    expect(key.type).toBe('RecoverableEcdsaSecp256k1VerificationKey2019')
    expect(key.controller).toBe('did:example:123')
    expect(key.privateKeyJwk).toBeUndefined()
    expect(key.publicKeyJwk).toBeDefined()

    const {sign} = key.signer()

    try {
      await sign('test')
    } catch (e) {
      expect(e.message).toBe('No private key to sign with.')
    }
  })

  it('verify fails when header is bad', async () => {
    expect.assertions(2)
    key = new RecoverableEcdsaSecp256k1KeyClass2019({
      controller: 'did:example:123',
      privateKeyJwk: privateKeyJwk,
    })
    const {verify} = key.verifier()
    expect(typeof verify).toBe('function')

    const signature =
      'eyJhbGciOiJFUzI1NksiLCJiNjQiOmZhbHNlfQ..hi293ia5YYznl0mS9_-Z0wHoFcSuo3qaWVVJwEXtwn0olNhSi95nx9RIJbsAcUNMmLc4ISih7HxyUs9pXyzcrw'
    const result = await verify({
      data,
      signature,
    })

    expect(result).toBe(false)
  })

  it('verify fails with broken header', async () => {
    expect.assertions(1)
    key = new RecoverableEcdsaSecp256k1KeyClass2019({
      controller: 'did:example:123',
      privateKeyJwk: privateKeyJwk,
    })
    const {verify} = key.verifier()

    try {
      const signature =
        'eyJhbGciOiJFUzNksiLCJiNjQiOmZhbHNlfQ..hi293ia5YYznl0mS9_-Z0wHoFcSuo3qaWVVJwEXtwn0olNhSi95nx9RIJbsAcUNMmLc4ISih7HxyUs9pXyzcrw'
      await verify({
        data,
        signature,
      })
    } catch (e) {
      expect(e.message).toBe('Could not parse JWS header; SyntaxError: Unexpected token � in JSON at position 14')
    }
  })
})
