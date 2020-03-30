import {DIDUtils} from '@bloomprotocol/vc-common'

const {MnemonicKeySystem} = require('@transmute/element-lib')

import {buildVCV1Subject, buildVCV1} from '../../../src/build/v1'

const generateDID = async () => {
  const mks = new MnemonicKeySystem(MnemonicKeySystem.generateMnemonic())
  const primaryKey = await mks.getKeyForPurpose('primary', 0)
  const recoveryKey = await mks.getKeyForPurpose('recovery', 0)

  const did = await DIDUtils.createElemDID({primaryKey, recoveryKey})

  return {
    did,
    primaryKey,
    recoveryKey,
  }
}

describe('buildVCV1Subject', () => {
  it('builds a VCV1Subject', async () => {
    expect.assertions(1)

    const {did} = await generateDID()

    const subject = await buildVCV1Subject({
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

    await expect(buildVCV1Subject({subject: (await generateDID()).did, data: {'@type': 'Thing', id: 'value'}})).rejects.toThrow()
  })

  it('throws when subject is not a valid DID', async () => {
    expect.assertions(1)

    await expect(buildVCV1Subject({subject: 'invalid subject', data: {'@type': 'Thing'}})).rejects.toThrow()
  })
})

describe('buildVCV1', () => {
  it('builds a VCV1', async () => {
    expect.assertions(1)

    const {did: subjectDID} = await generateDID()
    const issuer = await generateDID()

    const credentialSubject = await buildVCV1Subject({
      subject: subjectDID,
      data: {'@type': 'Thing', key: 'value'},
    })

    const atomicVC = await buildVCV1({
      id: 'acbfeba0af-b-23b-af0b1-0tbfa-asfasfasf',
      credentialSubject: credentialSubject,
      type: 'CustomCredential',
      holder: {
        id: subjectDID,
      },
      issuer: {
        did: issuer.did,
        keyId: '#primary',
        privateKey: issuer.primaryKey.privateKey,
        publicKey: issuer.primaryKey.publicKey,
      },
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      revocation: {
        id: 'token',
      },
    })

    expect(atomicVC).toEqual({
      id: 'acbfeba0af-b-23b-af0b1-0tbfa-asfasfasf',
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential', 'CustomCredential'],
      issuer: issuer.did,
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      credentialSubject: {
        id: subjectDID,
        data: {
          '@type': 'Thing',
          key: 'value',
        },
      },
      revocation: {
        id: 'token',
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

  it('builds a VCV1 with custom contexts', async () => {
    expect.assertions(1)

    const {did: subjectDID} = await generateDID()
    const issuer = await generateDID()

    const credentialSubject = await buildVCV1Subject({
      subject: subjectDID,
      data: {'@type': 'Thing', key: 'value'},
    })

    const atomicVC = await buildVCV1({
      id: 'afbcbaiocbafoiacbaofibaociabfoaibcoibaf',
      credentialSubject: credentialSubject,
      type: 'CustomCredential',
      holder: {
        id: subjectDID,
      },
      issuer: {
        did: issuer.did,
        keyId: '#primary',
        privateKey: issuer.primaryKey.privateKey,
        publicKey: issuer.primaryKey.publicKey,
      },
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      revocation: {
        id: 'token',
      },
      context: 'https://www.w3.org/2018/credentials/examples/v1',
    })

    expect(atomicVC).toEqual({
      '@context': ['https://www.w3.org/2018/credentials/v1', 'https://www.w3.org/2018/credentials/examples/v1'],
      id: 'afbcbaiocbafoiacbaofibaociabfoaibcoibaf',
      type: ['VerifiableCredential', 'CustomCredential'],
      issuer: issuer.did,
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      credentialSubject: {
        id: subjectDID,
        data: {
          '@type': 'Thing',
          key: 'value',
        },
      },
      revocation: {
        id: 'token',
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

  it('builds a VCV1 with multiple credentials', async () => {
    expect.assertions(1)

    const {did: subjectDID} = await generateDID()
    const issuer = await generateDID()

    const credentialSubject1 = await buildVCV1Subject({
      subject: subjectDID,
      data: {'@type': 'Thing', key: 'value 1'},
    })

    const credentialSubject2 = await buildVCV1Subject({
      subject: subjectDID,
      data: {'@type': 'Thing', key: 'value 2'},
    })

    const atomicVC = await buildVCV1({
      id: 'afbcbaiocbafoiacbaofibaociabfoaibcoibaf',
      credentialSubject: [credentialSubject1, credentialSubject2],
      type: 'CustomCredential',
      holder: {
        id: subjectDID,
      },
      issuer: {
        did: issuer.did,
        keyId: '#primary',
        privateKey: issuer.primaryKey.privateKey,
        publicKey: issuer.primaryKey.publicKey,
      },
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      revocation: {
        id: 'token',
      },
    })

    expect(atomicVC).toEqual({
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      id: 'afbcbaiocbafoiacbaofibaociabfoaibcoibaf',
      type: ['VerifiableCredential', 'CustomCredential'],
      issuer: issuer.did,
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      credentialSubject: [
        {
          id: subjectDID,
          data: {
            '@type': 'Thing',
            key: 'value 1',
          },
        },
        {
          id: subjectDID,
          data: {
            '@type': 'Thing',
            key: 'value 2',
          },
        },
      ],
      revocation: {
        id: 'token',
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

  it('builds a VCV1 with multiple types', async () => {
    expect.assertions(1)

    const {did: subjectDID} = await generateDID()
    const issuer = await generateDID()

    const credentialSubject1 = await buildVCV1Subject({
      subject: subjectDID,
      data: {'@type': 'Thing', key: 'value 1'},
    })

    const credentialSubject2 = await buildVCV1Subject({
      subject: subjectDID,
      data: {'@type': 'Thing', key: 'value 2'},
    })

    const atomicVC = await buildVCV1({
      id: 'iasdoihasdofaisdhfoiasdhfoaisdfhaosdf',
      credentialSubject: [credentialSubject1, credentialSubject2],
      type: ['CustomCredential1', 'CustomCredential2'],
      holder: {
        id: subjectDID,
      },
      issuer: {
        did: issuer.did,
        keyId: '#primary',
        privateKey: issuer.primaryKey.privateKey,
        publicKey: issuer.primaryKey.publicKey,
      },
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      revocation: {
        id: 'token',
      },
    })

    expect(atomicVC).toEqual({
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      id: 'iasdoihasdofaisdhfoiasdhfoaisdfhaosdf',
      type: ['VerifiableCredential', 'CustomCredential1', 'CustomCredential2'],
      issuer: issuer.did,
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      credentialSubject: [
        {
          id: subjectDID,
          data: {
            '@type': 'Thing',
            key: 'value 1',
          },
        },
        {
          id: subjectDID,
          data: {
            '@type': 'Thing',
            key: 'value 2',
          },
        },
      ],
      revocation: {
        id: 'token',
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
