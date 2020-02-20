import * as JWS from '../src/JWS'
import {keyUtils} from '@transmute/es256k-jws-ts'

const privateJWK = {
  crv: 'secp256k1',
  d: 'rhYFsBPF9q3-uZThy7B3c4LDF_8wnozFUAEm5LLC4Zw',
  kid: 'JUvpllMEYUZ2joO59UNui_XYDqxVqiFLLAJ8klWuPBw',
  kty: 'EC',
  x: 'dWCvM4fTdeM0KmloF57zxtBPXTOythHPMm1HCLrdd3A',
  y: '36uMVGM7hnw-N6GnjFcihWE3SkrhMLzzLCdPMXPEXlA',
}

const publicJWK = {
  crv: 'secp256k1',
  kid: 'JUvpllMEYUZ2joO59UNui_XYDqxVqiFLLAJ8klWuPBw',
  kty: 'EC',
  x: 'dWCvM4fTdeM0KmloF57zxtBPXTOythHPMm1HCLrdd3A',
  y: '36uMVGM7hnw-N6GnjFcihWE3SkrhMLzzLCdPMXPEXlA',
}

const payload = Buffer.from('hello')

describe('JWS', () => {
  describe('signDetached', () => {
    it('should produce a JWS', async () => {
      const {jws, recoveryId} = await JWS.signDetached(payload, privateJWK)
      expect(jws).toBe(
        'eyJhbGciOiJFUzI1NksiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..s6JgLOw7kPIGyNzRqoCcNEuscED32DsX3THfwyWPcfUna010iC9-ZYSG78Njknc_t3P11-yuceQuL9AXXNBMMA',
      )
      expect(recoveryId).toBe(0)
    })
  })

  describe('verifyDetached', () => {
    it('should return the decoded payload for a valid JWS', async () => {
      const jws =
        'eyJhbGciOiJFUzI1NksiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..s6JgLOw7kPIGyNzRqoCcNEuscED32DsX3THfwyWPcfUna010iC9-ZYSG78Njknc_t3P11-yuceQuL9AXXNBMMA'
      const verified = await keyUtils.publicJWKFromPublicKeyHex(await JWS.verifyDetached(jws, payload, 0))

      expect(verified).toEqual(expect.objectContaining(publicJWK))
    })
  })
})
