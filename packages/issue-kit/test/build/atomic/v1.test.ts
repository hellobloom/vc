import EthWallet from 'ethereumjs-wallet'
import base64url from 'base64url'
const {op, func} = require('@transmute/element-lib')

import {buildAtomicVCSubjectV1, buildAtomicVCV1} from '../../../src/build/atomic/v1'

const generateDID = async () => {
  const primaryKey = EthWallet.generate()
  const recoveryKey = EthWallet.generate()

  const didDocumentModel = {
    ...op.getDidDocumentModel(primaryKey.getPublicKeyString(), recoveryKey.getPublicKeyString()),
    '@context': 'https://w3id.org/security/v2',
    authentication: ['#primary'],
    assertionMethod: ['#primary'],
  }
  const createPayload = await op.getCreatePayload(didDocumentModel, {privateKey: primaryKey.getPrivateKey()})
  const didUniqueSuffix = func.getDidUniqueSuffix(createPayload)

  console.log({didDocumentModel})

  return {
    did: `did:elem:${didUniqueSuffix};elem:initial-state=${base64url.encode(JSON.stringify(createPayload))}`,
    baseDID: `did:elem:${didUniqueSuffix}`,
    primaryKey,
    recoveryKey,
  }
}

describe('buildAtomicVCSubjectV1', () => {
  it('builds an AtomicVCSubjectV1', async () => {
    expect.assertions(1)

    const {did} = await generateDID()

    const subject = await buildAtomicVCSubjectV1({
      subject: did,
      data: {'@type': 'Thing', key: 'value'},
    })

    expect(subject).toEqual(
      expect.objectContaining({
        id: did,
        data: {
          '@type': 'Thing',
          key: 'value',
        },
      }),
    )
  })

  it('throws when data contains an "id" field', async () => {
    expect.assertions(1)

    await expect(buildAtomicVCSubjectV1({subject: (await generateDID()).did, data: {'@type': 'Thing', id: 'value'}})).rejects.toThrow()
  })

  it('throws when subject is not a valid DID', async () => {
    expect.assertions(1)

    await expect(buildAtomicVCSubjectV1({subject: 'invalid subject', data: {'@type': 'Thing'}})).rejects.toThrow()
  })
})

describe('buildAtomicVCV1', () => {
  it('builds an AtomicVCV1', async () => {
    expect.assertions(1)

    const subject = await generateDID()
    const issuer = await generateDID()

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: subject.did,
      data: {'@type': 'Thing', key: 'value'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject: credentialSubject,
      type: ['CustomCredential'],
      issuer: {
        did: issuer.did,
        keyId: '#primary',
        privateKey: issuer.primaryKey.getPrivateKeyString(),
        publicKey: issuer.primaryKey.getPublicKeyString(),
      },
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      revocation: {
        '@context': 'https://example.com',
        token: 'token',
      },
    })

    expect(atomicVC).toEqual({
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential', 'CustomCredential'],
      issuer: issuer.did,
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      credentialSubject: {
        id: subject.did,
        data: {
          '@type': 'Thing',
          key: 'value',
        },
      },
      revocation: {
        '@context': 'https://example.com',
        token: 'token',
      },
      proof: {
        type: 'EcdsaSecp256k1Signature2019',
        created: expect.any(String),
        verificationMethod: `${issuer.did}#primary`,
        proofPurpose: 'assertionMethod',
        jws: expect.any(String),
      },
    })
  })

  it('builds an AtomicVCV1 with custom contexts', async () => {
    expect.assertions(1)

    const subject = await generateDID()
    const issuer = await generateDID()

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: subject.did,
      data: {'@type': 'Thing', key: 'value'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject: credentialSubject,
      type: ['CustomCredential'],
      issuer: {
        did: issuer.did,
        keyId: '#primary',
        privateKey: issuer.primaryKey.getPrivateKeyString(),
        publicKey: issuer.primaryKey.getPublicKeyString(),
      },
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      revocation: {
        '@context': 'https://example.com',
        token: 'token',
      },
      context: 'https://www.w3.org/2018/credentials/examples/v1',
    })

    expect(atomicVC).toEqual({
      '@context': ['https://www.w3.org/2018/credentials/v1', 'https://www.w3.org/2018/credentials/examples/v1'],
      type: ['VerifiableCredential', 'CustomCredential'],
      issuer: issuer.did,
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      credentialSubject: {
        id: subject.did,
        data: {
          '@type': 'Thing',
          key: 'value',
        },
      },
      revocation: {
        '@context': 'https://example.com',
        token: 'token',
      },
      proof: {
        type: 'EcdsaSecp256k1Signature2019',
        created: expect.any(String),
        verificationMethod: `${issuer.did}#primary`,
        proofPurpose: 'assertionMethod',
        jws: expect.any(String),
      },
    })
  })

  it('builds an AtomicVCV1 with multiple credentials', async () => {
    expect.assertions(1)

    const subject = await generateDID()
    const issuer = await generateDID()

    const credentialSubject1 = await buildAtomicVCSubjectV1({
      subject: subject.did,
      data: {'@type': 'Thing', key: 'value 1'},
    })

    const credentialSubject2 = await buildAtomicVCSubjectV1({
      subject: subject.did,
      data: {'@type': 'Thing', key: 'value 2'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject: [credentialSubject1, credentialSubject2],
      type: ['CustomCredential'],
      issuer: {
        did: issuer.did,
        keyId: '#primary',
        privateKey: issuer.primaryKey.getPrivateKeyString(),
        publicKey: issuer.primaryKey.getPublicKeyString(),
      },
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      revocation: {
        '@context': 'https://example.com',
        token: 'token',
      },
    })

    expect(atomicVC).toEqual({
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential', 'CustomCredential'],
      issuer: issuer.did,
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      credentialSubject: [
        {
          id: subject.did,
          data: {
            '@type': 'Thing',
            key: 'value 1',
          },
        },
        {
          id: subject.did,
          data: {
            '@type': 'Thing',
            key: 'value 2',
          },
        },
      ],
      revocation: {
        '@context': 'https://example.com',
        token: 'token',
      },
      proof: {
        type: 'EcdsaSecp256k1Signature2019',
        created: expect.any(String),
        verificationMethod: `${issuer.did}#primary`,
        proofPurpose: 'assertionMethod',
        jws: expect.any(String),
      },
    })
  })
})
