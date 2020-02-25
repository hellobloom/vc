import EthWallet from 'ethereumjs-wallet'

import {buildAtomicVCSubjectV1, buildAtomicVCV1} from '../../../src/build/atomic/v1'

const issuerWallet = EthWallet.fromPrivateKey(Buffer.from('efca4cdd31923b50f4214af5d2ae10e7ac45a5019e9431cc195482d707485378', 'hex'))
const issuerPrivKey = issuerWallet.getPrivateKey()

describe('buildAtomicVCSubjectV1', () => {
  it('builds an AtomicVCSubjectV1', async () => {
    expect.assertions(1)

    const did = `did:ethr:${EthWallet.generate().getAddressString()}`

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

    await expect(
      buildAtomicVCSubjectV1({subject: `did:ethr:${EthWallet.generate().getAddressString()}`, data: {'@type': 'Thing', id: 'value'}}),
    ).rejects.toThrow()
  })

  it('throws when subject is not a valid DID', async () => {
    expect.assertions(1)

    await expect(buildAtomicVCSubjectV1({subject: 'invalid subject', data: {'@type': 'Thing'}})).rejects.toThrow()
  })
})

describe('buildAtomicVCV1', () => {
  it('builds an AtomicVCV1', async () => {
    expect.assertions(1)

    const did = `did:ethr:${EthWallet.generate().getAddressString()}`

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: did,
      data: {'@type': 'Thing', key: 'value'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject: credentialSubject,
      type: ['CustomCredential'],
      privateKey: issuerPrivKey,
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
      issuer: `did:ethr:${issuerWallet.getAddressString()}`,
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      credentialSubject: {
        id: did,
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
        verificationMethod: 'did:ethr:0xb14ab53e38da1c172f877dbc6d65e4a1b0474c3c#owner',
        proofPurpose: 'assertionMethod',
        jws: expect.any(String),
        recoveryId: expect.any(Number),
      },
    })
  })

  it('builds an AtomicVCV1 with custom contexts', async () => {
    expect.assertions(1)

    const did = `did:ethr:${EthWallet.generate().getAddressString()}`

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: did,
      data: {'@type': 'Thing', key: 'value'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject: credentialSubject,
      type: ['CustomCredential'],
      privateKey: issuerPrivKey,
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
      issuer: `did:ethr:${issuerWallet.getAddressString()}`,
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      credentialSubject: {
        id: did,
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
        verificationMethod: 'did:ethr:0xb14ab53e38da1c172f877dbc6d65e4a1b0474c3c#owner',
        proofPurpose: 'assertionMethod',
        jws: expect.any(String),
        recoveryId: expect.any(Number),
      },
    })
  })

  it('builds an AtomicVCV1 with multiple credentials', async () => {
    expect.assertions(1)

    const did = `did:ethr:${EthWallet.generate().getAddressString()}`

    const credentialSubject1 = await buildAtomicVCSubjectV1({
      subject: did,
      data: {'@type': 'Thing', key: 'value 1'},
    })

    const credentialSubject2 = await buildAtomicVCSubjectV1({
      subject: did,
      data: {'@type': 'Thing', key: 'value 2'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject: [credentialSubject1, credentialSubject2],
      type: ['CustomCredential'],
      privateKey: issuerPrivKey,
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
      issuer: `did:ethr:${issuerWallet.getAddressString()}`,
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      credentialSubject: [
        {
          id: did,
          data: {
            '@type': 'Thing',
            key: 'value 1',
          },
        },
        {
          id: did,
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
        verificationMethod: 'did:ethr:0xb14ab53e38da1c172f877dbc6d65e4a1b0474c3c#owner',
        proofPurpose: 'assertionMethod',
        jws: expect.any(String),
        recoveryId: expect.any(Number),
      },
    })
  })
})
