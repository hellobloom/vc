const jsigs = require('jsonld-signatures')
import {defaultDocumentLoader} from '@transmute/lds-ecdsa-secp256k1-2019'

import {RecoverableEcdsaSecp256k1Signature2019} from '../src/RecoverableEcdsaSecp256k1Signature2019'
import {RecoverableEcdsaSecp256k1KeyClass2019} from '../src/RecoverableEcdsaSecp256k1KeyClass2019'
import {RecoverableAssertionProofPurpose} from '../src/purposes'

const didDoc = {
  '@context': 'https://w3id.org/did/v1',
  id: 'did:example:123',
  publicKey: [
    {
      id: 'did:example:123#iNsTBesVms1oFqfo0LtiIKqCQ_JUMajl8Mt5HDmS-24',
      type: 'RecoverableEcdsaSecp256k1VerificationKey2019',
      controller: 'did:example:123',
      publicKeyJwk: {
        crv: 'Ed25519',
        x: 'WqRFX1aJLKHX6CuOqvMvdtlHyM998411Jl9pYHFtlHk',
        kty: 'OKP',
        kid: 'iNsTBesVms1oFqfo0LtiIKqCQ_JUMajl8Mt5HDmS-24',
      },
    },
    {
      id: 'did:example:123#WqzaOweASs78whhl_YvCEvj1nd89IycryVlmZMefcjU',
      type: 'RecoverableEcdsaSecp256k1VerificationKey2019',
      controller: 'did:example:123',
      publicKeyJwk: {
        crv: 'secp256k1',
        x: '4xAbUxbGGFPv4qpHlPFAUJdzteUGR1lRK-CELCufU9w',
        y: 'EYcgCTsff1qtZjI9_ckZTXDSKAIuM0BknrKgo0BZ_Is',
        kty: 'EC',
        kid: 'WqzaOweASs78whhl_YvCEvj1nd89IycryVlmZMefcjU',
      },
    },
    {
      id: 'did:example:123#GB0wZ_ixlb8YqGhp2GS3REyP_mx7CaPJbMvomfVtAR4',
      type: 'RecoverableEcdsaSecp256k1VerificationKey2019',
      controller: 'did:example:123',
      publicKeyJwk: {
        e: 'AQAB',
        n:
          'wtHmY9-asBUEy906F40OUQ1C-dMDYCdqvScvMhSzVJdZ6VToNsn6YAWxASBjIv8xrmsitmO49biyprlwMUM0ccd25le-2tE7uf341OZDAl_NOrIwHK8p6u3f8mHdMLYyKvrq0Y6YpPjuj8T64IhuglSdr_4QafwSowoeHYG6M8xQGfYgg1AqCHkxPKFKsmp1ELzVm1XcGafbOnafaZevEiYhZ34cf_FMCoBT0M0xOUWa5WIb6my_Qn48Ggz90M0JZM1CRziMctvFyDDCzH9IgJngQTMdKCcfBqtfzliZwmFnl-UTn5Azh12WVpnQkF3qGqoliTmSS9He832HwGJDId-lHCqVNq9YvmE67N9gF7IuNH5PZg8UqRoFt1O8GE8Dn6UPwAZFiGVX-sdzNnd-EaGirlDoQZ2fjC8fAgw3yBUwZihYx06Igwa69yJnCzYdm4mfmaHt5FRW2zEml8mjBh3RkaxOYSX-WSdmB8okHV915kR_QUp_yANwqiZSNfPXgkX6yCugbpcnxMlKLQMbOODmJeZsCXK-5ORNLnGgRujNn-wSZ9cBfD0RwH6H3OxDLOLTOqXU5ORqaSiDbX30Kv9XaTpnj29uPB3x2IHGNSyhOn5oRToW_0oN-BAHlOU34FITpnyyDuOYZsWa1prZ6-vf_lkm63dt9rAt0udV4b8',
        kty: 'RSA',
        kid: 'GB0wZ_ixlb8YqGhp2GS3REyP_mx7CaPJbMvomfVtAR4',
      },
    },
    {
      id: 'did:example:123#Tixgh5u-CviXqb6c-v0rhEzamw_F4xFoOyRHE7Qizgk',
      type: 'RecoverableEcdsaSecp256k1VerificationKey2019',
      controller: 'did:example:123',
      publicKeyJwk: {
        crv: 'P-256',
        x: 'Bd3KT1sxOExqLuyJgnQUOtYlkoF2CRBShsqJvEHS9H4',
        y: '0PGXXODtbRd59l5wQxateDoPIjXYAOc_KlnWoH4th74',
        kty: 'EC',
        kid: 'Tixgh5u-CviXqb6c-v0rhEzamw_F4xFoOyRHE7Qizgk',
      },
    },
  ],
  authentication: [
    'did:example:123#iNsTBesVms1oFqfo0LtiIKqCQ_JUMajl8Mt5HDmS-24',
    'did:example:123#WqzaOweASs78whhl_YvCEvj1nd89IycryVlmZMefcjU',
    'did:example:123#GB0wZ_ixlb8YqGhp2GS3REyP_mx7CaPJbMvomfVtAR4',
    'did:example:123#Tixgh5u-CviXqb6c-v0rhEzamw_F4xFoOyRHE7Qizgk',
  ],
  assertionMethod: [
    'did:example:123#iNsTBesVms1oFqfo0LtiIKqCQ_JUMajl8Mt5HDmS-24',
    'did:example:123#WqzaOweASs78whhl_YvCEvj1nd89IycryVlmZMefcjU',
    'did:example:123#GB0wZ_ixlb8YqGhp2GS3REyP_mx7CaPJbMvomfVtAR4',
    'did:example:123#Tixgh5u-CviXqb6c-v0rhEzamw_F4xFoOyRHE7Qizgk',
  ],
  capabilityDelegation: [
    'did:example:123#iNsTBesVms1oFqfo0LtiIKqCQ_JUMajl8Mt5HDmS-24',
    'did:example:123#WqzaOweASs78whhl_YvCEvj1nd89IycryVlmZMefcjU',
    'did:example:123#GB0wZ_ixlb8YqGhp2GS3REyP_mx7CaPJbMvomfVtAR4',
    'did:example:123#Tixgh5u-CviXqb6c-v0rhEzamw_F4xFoOyRHE7Qizgk',
  ],
  capabilityInvocation: [
    'did:example:123#iNsTBesVms1oFqfo0LtiIKqCQ_JUMajl8Mt5HDmS-24',
    'did:example:123#WqzaOweASs78whhl_YvCEvj1nd89IycryVlmZMefcjU',
    'did:example:123#GB0wZ_ixlb8YqGhp2GS3REyP_mx7CaPJbMvomfVtAR4',
    'did:example:123#Tixgh5u-CviXqb6c-v0rhEzamw_F4xFoOyRHE7Qizgk',
  ],
}

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

const payload = {
  '@context': [
    {
      schema: 'http://schema.org/',
      name: 'schema:name',
      homepage: 'schema:url',
      image: 'schema:image',
    },
  ],
  name: 'Manu Sporny',
  homepage: 'https://manu.sporny.org/',
  image: 'https://manu.sporny.org/images/manu.png',
}

const contexts: any = {
  'https://w3id.org/did/v1': require('./contexts/did-v0.11.json'),
  'https://w3id.org/security/v1': require('./contexts/security-v1.json'),
  'https://w3id.org/security/v2': require('./contexts/security-v2.json'),
}

const mockLoader = (url: string) => {
  const context = contexts[url]

  if (context) {
    return {
      contextUrl: null, // this is for a context via a link header
      document: context, // this is the actual document that was loaded
      documentUrl: url, // this is the actual context URL after redirects
    }
  }

  if (url === 'did:example:123') {
    return {
      contextUrl: null, // this is for a context via a link header
      document: didDoc, // this is the actual document that was loaded
      documentUrl: url, // this is the actual context URL after redirects
    }
  }

  if (url === 'did:example:123#WqzaOweASs78whhl_YvCEvj1nd89IycryVlmZMefcjU') {
    return {
      contextUrl: null, // this is for a context via a link header
      document: didDoc, // this is the actual document that was loaded
      documentUrl: 'did:example:123', // this is the actual context URL after redirects
    }
  }
  throw new Error('No custom context support for ' + url)
}

describe('assertVerificationMethod', () => {
  it('Invalid key type. Key type must be "RecoverableEcdsaSecp256k1VerificationKey2019".', async () => {
    expect.assertions(1)
    const key = new RecoverableEcdsaSecp256k1KeyClass2019({
      controller: 'did:example:123',
      privateKeyJwk: privateKeyJwk,
    })
    const suite = new RecoverableEcdsaSecp256k1Signature2019({key})
    try {
      await suite.assertVerificationMethod({
        verificationMethod: '123',
      })
    } catch (e) {
      expect(e.message).toBe('Invalid key type. Key type must be "RecoverableEcdsaSecp256k1VerificationKey2019".')
    }
  })

  it('works', async () => {
    expect.assertions(1)
    const key = new RecoverableEcdsaSecp256k1KeyClass2019({
      controller: 'did:example:123',
      privateKeyJwk: privateKeyJwk,
    })
    const suite = new RecoverableEcdsaSecp256k1Signature2019({key})
    const res = await suite.assertVerificationMethod({
      verificationMethod: didDoc.publicKey[1],
    })
    expect(res).toBeUndefined()
  })
})

describe('getVerificationMethod', () => {
  it('works', async () => {
    const key = new RecoverableEcdsaSecp256k1KeyClass2019({
      controller: 'did:example:123',
      privateKeyJwk: privateKeyJwk,
    })
    const suite = new RecoverableEcdsaSecp256k1Signature2019({key})

    const signed = await jsigs.sign(
      {...payload},
      {
        compactProof: false,
        documentLoader: mockLoader,
        purpose: new RecoverableAssertionProofPurpose({addressKey: 'ethereumAddress', keyToAddress: () => ''}),
        suite,
      },
    )

    const res = await suite.getVerificationMethod({
      proof: signed.proof,
      documentLoader: defaultDocumentLoader,
    })

    expect(res.id).toBe('did:example:123#WqzaOweASs78whhl_YvCEvj1nd89IycryVlmZMefcjU')
  })

  it('can get from proof', async () => {
    const key = new RecoverableEcdsaSecp256k1KeyClass2019({
      controller: 'did:example:123',
      privateKeyJwk: privateKeyJwk,
    })
    let suite = new RecoverableEcdsaSecp256k1Signature2019({key})

    const signed = await jsigs.sign(
      {...payload},
      {
        compactProof: false,
        documentLoader: mockLoader,
        purpose: new RecoverableAssertionProofPurpose({addressKey: 'ethereumAddress', keyToAddress: () => ''}),
        suite,
      },
    )

    // will get from proof
    suite = new RecoverableEcdsaSecp256k1Signature2019({
      key: new RecoverableEcdsaSecp256k1KeyClass2019({
        controller: 'did:example:123',
        publicKeyJwk: publicKeyJwk,
      }),
    })

    const res = await suite.getVerificationMethod({
      proof: signed.proof,
      documentLoader: mockLoader,
    })

    expect(res.id).toBe('did:example:123#WqzaOweASs78whhl_YvCEvj1nd89IycryVlmZMefcjU')
  })
})

describe('verifySignature', () => {
  it('fails with bad data', async () => {
    expect.assertions(1)
    const key = new RecoverableEcdsaSecp256k1KeyClass2019({
      controller: 'did:example:123',
      privateKeyJwk: privateKeyJwk,
    })
    let suite = new RecoverableEcdsaSecp256k1Signature2019({key})

    const signed = await jsigs.sign(
      {...payload},
      {
        compactProof: false,
        documentLoader: mockLoader,
        purpose: new RecoverableAssertionProofPurpose({addressKey: 'ethereumAddress', keyToAddress: () => ''}),
        suite,
      },
    )

    const {verified} = await jsigs.verify(
      {
        data: 'bad',
        proof: signed.proof,
      },
      {
        compactProof: false,
        documentLoader: mockLoader,
        purpose: new RecoverableAssertionProofPurpose({addressKey: 'ethereumAddress', keyToAddress: () => ''}),
        expansionMap: false,
        suite,
      },
    )

    expect(verified).toBe(false)
  })
})

describe('matchProof', () => {
  it('returns false when super fails', async () => {
    const key = new RecoverableEcdsaSecp256k1KeyClass2019({
      controller: 'did:example:123',
      privateKeyJwk: privateKeyJwk,
    })

    const suite = new RecoverableEcdsaSecp256k1Signature2019({key})

    const signed = await jsigs.sign(
      {...payload},
      {
        compactProof: false,
        documentLoader: mockLoader,
        purpose: new RecoverableAssertionProofPurpose({addressKey: 'ethereumAddress', keyToAddress: () => ''}),
        suite,
      },
    )

    signed.proof.type = 'bar'

    const res = await suite.matchProof({
      proof: signed.proof,
      document: signed,
      purpose: signed.proof.proofPurpose,
      documentLoader: mockLoader,
      expansionMap: false,
    })

    expect(res).toBe(false)
  })
})
