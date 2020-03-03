import {EthUtils, DIDUtils, Utils, AtomicVCV1, VPV1} from '@bloomprotocol/attestations-common'
import {buildAtomicVCSubjectV1, buildAtomicVCV1} from '@bloomprotocol/issue-kit'
import {EcdsaSecp256k1KeyClass2019, EcdsaSecp256k1Signature2019} from '@transmute/lds-ecdsa-secp256k1-2019'
import EthWallet from 'ethereumjs-wallet'
import {keyUtils} from '@transmute/es256k-jws-ts'
import base64url from 'base64url'
const {op, func} = require('@transmute/element-lib')

const jsigs = require('jsonld-signatures')
const {AuthenticationProofPurpose} = jsigs.purposes

import * as Validation from '../../../../src/validate/v1/structure'

type DIDConfig = {
  did: string
  primaryKey: EthWallet
  recoveryKey: EthWallet
}

const generateDID = async (): Promise<DIDConfig> => {
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

  return {
    did: `did:elem:${didUniqueSuffix};elem:initial-state=${base64url.encode(JSON.stringify(createPayload))}`,
    primaryKey,
    recoveryKey,
  }
}

const buildVerifiablePresentation = async ({
  didConfig,
  atomicCredentials,
  token,
  domain,
}: {
  atomicCredentials: AtomicVCV1[]
  token: string
  domain: string
  didConfig: DIDConfig
}): Promise<VPV1> => {
  const didDocument = await DIDUtils.resolveDID(didConfig.did)
  const publicKey = didDocument.publicKey.find(({id}) => id.endsWith('#primary'))

  if (!publicKey) throw new Error('Cannot find primary key')

  const unsignedVP: Omit<VPV1<AtomicVCV1>, 'proof'> = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiablePresentation'],
    verifiableCredential: atomicCredentials,
    holder: didConfig.did,
  }

  const privateKeyJwk = await keyUtils.privateJWKFromPrivateKeyHex(didConfig.primaryKey.getPrivateKeyString().replace('0x', ''))

  const vp: VPV1 = await jsigs.sign(unsignedVP, {
    suite: new EcdsaSecp256k1Signature2019({
      key: new EcdsaSecp256k1KeyClass2019({
        id: publicKey.id,
        controller: didConfig.did,
        privateKeyJwk,
      }),
    }),
    documentLoader: DIDUtils.documentLoader,
    purpose: new AuthenticationProofPurpose({
      challenge: token,
      domain,
    }),
    compactProof: false,
    expansionMap: false, // TODO: remove this
  })

  return vp
}

describe('Validation.validateCredentialSubject', () => {
  it('passes', async () => {
    expect.assertions(1)

    const didConfig = await generateDID()

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: didConfig.did,
      data: {'@type': 'Thing'},
    })

    expect(Utils.isValid(Validation.validateCredentialSubject)(credentialSubject)).toBeTruthy()
  })

  it('fails with empty subject', async () => {
    expect.assertions(1)

    const didConfig = await generateDID()

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: didConfig.did,
      data: {'@type': 'Thing'},
    })

    expect(
      Utils.isValid(Validation.validateCredentialSubject)({
        ...credentialSubject,
        id: '',
      }),
    ).toBeFalsy()
  })

  it('fails with empty type', async () => {
    expect.assertions(1)

    const didConfig = await generateDID()

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: didConfig.did,
      data: {'@type': ''},
    })

    expect(Utils.isValid(Validation.validateCredentialSubject)(credentialSubject)).toBeFalsy()
  })
})

describe('Validation.validateCredentialRevocation', () => {
  it('passes', () => {
    expect(Utils.isValid(Validation.validateCredentialRevocation)({'@context': 'https://example.com'})).toBeTruthy()
  })

  it('fails with empty context', () => {
    expect(Utils.isValid(Validation.validateCredentialRevocation)({'@context': ''})).toBeFalsy()
  })
})

describe('Validation.validateCredentialProof', () => {
  it('passes', async () => {
    expect.assertions(1)

    const subjectDID = await generateDID()
    const issuerDID = await generateDID()

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: subjectDID.did,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      issuer: {
        did: issuerDID.did,
        keyId: '#primary',
        privateKey: issuerDID.primaryKey.getPrivateKeyString(),
        publicKey: issuerDID.primaryKey.getPublicKeyString(),
      },
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      revocation: {
        '@context': 'https://example.com',
        token: '1234',
      },
    })

    expect(Utils.isValid(Validation.validateCredentialProof)(atomicVC.proof)).toBeTruthy()
  })

  it('fails with invalid type', async () => {
    expect.assertions(1)

    const subjectDID = await generateDID()
    const issuerDID = await generateDID()

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: subjectDID.did,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      issuer: {
        did: issuerDID.did,
        keyId: '#primary',
        privateKey: issuerDID.primaryKey.getPrivateKeyString(),
        publicKey: issuerDID.primaryKey.getPublicKeyString(),
      },
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      revocation: {
        '@context': 'https://example.com',
        token: '1234',
      },
    })

    expect(
      Utils.isValid(Validation.validateCredentialProof)({
        ...atomicVC.proof,
        type: '',
      }),
    ).toBeFalsy()
  })

  it('fails with invalid created', async () => {
    expect.assertions(1)

    const subjectDID = await generateDID()
    const issuerDID = await generateDID()

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: subjectDID.did,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      issuer: {
        did: issuerDID.did,
        keyId: '#primary',
        privateKey: issuerDID.primaryKey.getPrivateKeyString(),
        publicKey: issuerDID.primaryKey.getPublicKeyString(),
      },
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      revocation: {
        '@context': 'https://example.com',
        token: '1234',
      },
    })

    expect(
      Utils.isValid(Validation.validateCredentialProof)({
        ...atomicVC.proof,
        created: '2016-02-01',
      }),
    ).toBeFalsy()
  })

  it('fails with invalid proofPurpose', async () => {
    expect.assertions(1)

    const subjectDID = await generateDID()
    const issuerDID = await generateDID()

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: subjectDID.did,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      issuer: {
        did: issuerDID.did,
        keyId: '#primary',
        privateKey: issuerDID.primaryKey.getPrivateKeyString(),
        publicKey: issuerDID.primaryKey.getPublicKeyString(),
      },
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      revocation: {
        '@context': 'https://example.com',
        token: '1234',
      },
    })

    expect(
      Utils.isValid(Validation.validateCredentialProof)({
        ...atomicVC.proof,
        proofPurpose: '',
      }),
    ).toBeFalsy()
  })

  it('fails with invalid verificationMethod', async () => {
    expect.assertions(1)

    const subjectDID = await generateDID()
    const issuerDID = await generateDID()

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: subjectDID.did,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      issuer: {
        did: issuerDID.did,
        keyId: '#primary',
        privateKey: issuerDID.primaryKey.getPrivateKeyString(),
        publicKey: issuerDID.primaryKey.getPublicKeyString(),
      },
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      revocation: {
        '@context': 'https://example.com',
        token: '1234',
      },
    })

    expect(
      Utils.isValid(Validation.validateCredentialProof)({
        ...atomicVC.proof,
        verificationMethod: '',
      }),
    ).toBeFalsy()
  })

  it('fails with invalid jws', async () => {
    expect.assertions(1)

    const subjectDID = await generateDID()
    const issuerDID = await generateDID()

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: subjectDID.did,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      issuer: {
        did: issuerDID.did,
        keyId: '#primary',
        privateKey: issuerDID.primaryKey.getPrivateKeyString(),
        publicKey: issuerDID.primaryKey.getPublicKeyString(),
      },
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      revocation: {
        '@context': 'https://example.com',
        token: '1234',
      },
    })

    expect(
      Utils.isValid(Validation.validateCredentialProof)({
        ...atomicVC.proof,
        jws: '',
      }),
    ).toBeFalsy()
  })
})

describe('Validation.validateVerifiableCredential', () => {
  it('passes', async () => {
    expect.assertions(1)

    const subjectDID = await generateDID()
    const issuerDID = await generateDID()

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: subjectDID.did,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      issuer: {
        did: issuerDID.did,
        keyId: '#primary',
        privateKey: issuerDID.primaryKey.getPrivateKeyString(),
        publicKey: issuerDID.primaryKey.getPublicKeyString(),
      },
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      revocation: {
        '@context': 'https://example.com',
        token: '1234',
      },
    })

    await expect(Utils.isAsyncValid(Validation.validateVerifiableCredential)(atomicVC)).resolves.toBeTruthy()
  })

  it('passes wihtout an expiration date', async () => {
    expect.assertions(1)

    const subjectDID = await generateDID()
    const issuerDID = await generateDID()

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: subjectDID.did,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      issuer: {
        did: issuerDID.did,
        keyId: '#primary',
        privateKey: issuerDID.primaryKey.getPrivateKeyString(),
        publicKey: issuerDID.primaryKey.getPublicKeyString(),
      },
      issuanceDate: '2016-02-01T00:00:00.000Z',
      revocation: {
        '@context': 'https://example.com',
        token: '1234',
      },
    })

    await expect(Utils.isAsyncValid(Validation.validateVerifiableCredential)(atomicVC)).resolves.toBeTruthy()
  })

  it('fails with invalid @context', async () => {
    expect.assertions(1)

    const subjectDID = await generateDID()
    const issuerDID = await generateDID()

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: subjectDID.did,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      issuer: {
        did: issuerDID.did,
        keyId: '#primary',
        privateKey: issuerDID.primaryKey.getPrivateKeyString(),
        publicKey: issuerDID.primaryKey.getPublicKeyString(),
      },
      issuanceDate: '2016-02-01T00:00:00.000Z',
      revocation: {
        '@context': 'https://example.com',
        token: '1234',
      },
    })

    await expect(
      Utils.isAsyncValid(Validation.validateVerifiableCredential)({
        ...atomicVC,
        '@context': [],
      }),
    ).resolves.toBeFalsy()
  })

  it('fails with invalid id', async () => {
    expect.assertions(1)

    const subjectDID = await generateDID()
    const issuerDID = await generateDID()

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: subjectDID.did,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      issuer: {
        did: issuerDID.did,
        keyId: '#primary',
        privateKey: issuerDID.primaryKey.getPrivateKeyString(),
        publicKey: issuerDID.primaryKey.getPublicKeyString(),
      },
      issuanceDate: '2016-02-01T00:00:00.000Z',
      revocation: {
        '@context': 'https://example.com',
        token: '1234',
      },
    })

    await expect(
      Utils.isAsyncValid(Validation.validateVerifiableCredential)({
        ...atomicVC,
        id: 1,
      }),
    ).resolves.toBeFalsy()
  })

  it('fails with invalid type', async () => {
    expect.assertions(1)

    const subjectDID = await generateDID()
    const issuerDID = await generateDID()

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: subjectDID.did,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      issuer: {
        did: issuerDID.did,
        keyId: '#primary',
        privateKey: issuerDID.primaryKey.getPrivateKeyString(),
        publicKey: issuerDID.primaryKey.getPublicKeyString(),
      },
      issuanceDate: '2016-02-01T00:00:00.000Z',
      revocation: {
        '@context': 'https://example.com',
        token: '1234',
      },
    })

    await expect(
      Utils.isAsyncValid(Validation.validateVerifiableCredential)({
        ...atomicVC,
        type: ['CustomCredential'],
      }),
    ).resolves.toBeFalsy()
  })

  it('fails with invalid issuer', async () => {
    expect.assertions(1)

    const subjectDID = await generateDID()
    const issuerDID = await generateDID()

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: subjectDID.did,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      issuer: {
        did: issuerDID.did,
        keyId: '#primary',
        privateKey: issuerDID.primaryKey.getPrivateKeyString(),
        publicKey: issuerDID.primaryKey.getPublicKeyString(),
      },
      issuanceDate: '2016-02-01T00:00:00.000Z',
      revocation: {
        '@context': 'https://example.com',
        token: '1234',
      },
    })

    await expect(
      Utils.isAsyncValid(Validation.validateVerifiableCredential)({
        ...atomicVC,
        issuer: '',
      }),
    ).resolves.toBeFalsy()
  })

  it('fails with invalid issuanceDate', async () => {
    expect.assertions(1)

    const subjectDID = await generateDID()
    const issuerDID = await generateDID()

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: subjectDID.did,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      issuer: {
        did: issuerDID.did,
        keyId: '#primary',
        privateKey: issuerDID.primaryKey.getPrivateKeyString(),
        publicKey: issuerDID.primaryKey.getPublicKeyString(),
      },
      issuanceDate: '2016-02-01',
      revocation: {
        '@context': 'https://example.com',
        token: '1234',
      },
    })

    await expect(Utils.isAsyncValid(Validation.validateVerifiableCredential)(atomicVC)).resolves.toBeFalsy()
  })

  it('fails with invalid expirationDate', async () => {
    expect.assertions(1)

    const subjectDID = await generateDID()
    const issuerDID = await generateDID()

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: subjectDID.did,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      issuer: {
        did: issuerDID.did,
        keyId: '#primary',
        privateKey: issuerDID.primaryKey.getPrivateKeyString(),
        publicKey: issuerDID.primaryKey.getPublicKeyString(),
      },
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2016-02-01',
      revocation: {
        '@context': 'https://example.com',
        token: '1234',
      },
    })

    await expect(Utils.isAsyncValid(Validation.validateVerifiableCredential)(atomicVC)).resolves.toBeFalsy()
  })

  it('fails with invalid credentialSubject', async () => {
    expect.assertions(1)

    const subjectDID = await generateDID()
    const issuerDID = await generateDID()

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: subjectDID.did,
      data: {'@type': ''},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      issuer: {
        did: issuerDID.did,
        keyId: '#primary',
        privateKey: issuerDID.primaryKey.getPrivateKeyString(),
        publicKey: issuerDID.primaryKey.getPublicKeyString(),
      },
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2016-02-01',
      revocation: {
        '@context': 'https://example.com',
        token: '1234',
      },
    })

    await expect(Utils.isAsyncValid(Validation.validateVerifiableCredential)(atomicVC)).resolves.toBeFalsy()
  })

  it('fails with invalid revocation', async () => {
    expect.assertions(1)

    const subjectDID = await generateDID()
    const issuerDID = await generateDID()

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: subjectDID.did,
      data: {'@type': ''},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      issuer: {
        did: issuerDID.did,
        keyId: '#primary',
        privateKey: issuerDID.primaryKey.getPrivateKeyString(),
        publicKey: issuerDID.primaryKey.getPublicKeyString(),
      },
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2016-02-01',
      revocation: {
        '@context': 'https://example.com',
        token: '1234',
      },
    })

    await expect(
      Utils.isAsyncValid(Validation.validateVerifiableCredential)({
        ...atomicVC,
        revocation: {
          '@context': '',
        },
      }),
    ).resolves.toBeFalsy()
  })

  it('fails with structurally invalid proof', async () => {
    expect.assertions(1)

    const subjectDID = await generateDID()
    const issuerDID = await generateDID()

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: subjectDID.did,
      data: {'@type': ''},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      issuer: {
        did: issuerDID.did,
        keyId: '#primary',
        privateKey: issuerDID.primaryKey.getPrivateKeyString(),
        publicKey: issuerDID.primaryKey.getPublicKeyString(),
      },
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2016-02-01',
      revocation: {
        '@context': 'https://example.com',
        token: '1234',
      },
    })

    await expect(
      Utils.isAsyncValid(Validation.validateVerifiableCredential)({
        ...atomicVC,
        proof: {
          ...atomicVC.proof,
          type: '',
        },
      }),
    ).resolves.toBeFalsy()
  })

  it('fails with invalid proof', async () => {
    expect.assertions(1)

    const subjectDID = await generateDID()
    const issuerDID = await generateDID()

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: subjectDID.did,
      data: {'@type': ''},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      issuer: {
        did: issuerDID.did,
        keyId: '#primary',
        privateKey: issuerDID.primaryKey.getPrivateKeyString(),
        publicKey: issuerDID.primaryKey.getPublicKeyString(),
      },
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2016-02-01',
      revocation: {
        '@context': 'https://example.com',
        token: '1234',
      },
    })

    await expect(
      Utils.isAsyncValid(Validation.validateVerifiableCredential)({
        ...atomicVC,
        proof: {
          ...atomicVC.proof,
          jws: '',
        },
      }),
    ).resolves.toBeFalsy()
  })
})

describe('Validation.validateVerifiablePresentationV1', () => {
  it('passes', async () => {
    expect.assertions(1)

    const subjectDID = await generateDID()
    const issuerDID = await generateDID()

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: subjectDID.did,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      issuer: {
        did: issuerDID.did,
        keyId: '#primary',
        privateKey: issuerDID.primaryKey.getPrivateKeyString(),
        publicKey: issuerDID.primaryKey.getPublicKeyString(),
      },
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      revocation: {
        '@context': 'https://example.com',
        token: '1234',
      },
    })

    const vp = await buildVerifiablePresentation({
      didConfig: subjectDID,
      atomicCredentials: [atomicVC],
      token: EthUtils.generateNonce(),
      domain: 'https://bloom.co/receiveData',
    })

    await expect(Utils.isAsyncValid(Validation.validateVerifiablePresentationV1)(vp)).resolves.toBeTruthy()
  })

  it('fails when subject and sharer differ', async () => {
    expect.assertions(1)

    const subjectDID = await generateDID()
    const separateSubjectDID = await generateDID()
    const issuerDID = await generateDID()

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: subjectDID.did,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      issuer: {
        did: issuerDID.did,
        keyId: '#primary',
        privateKey: issuerDID.primaryKey.getPrivateKeyString(),
        publicKey: issuerDID.primaryKey.getPublicKeyString(),
      },
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      revocation: {
        '@context': 'https://example.com',
        token: '1234',
      },
    })

    const vp = await buildVerifiablePresentation({
      didConfig: separateSubjectDID,
      atomicCredentials: [atomicVC],
      token: EthUtils.generateNonce(),
      domain: 'https://bloom.co/receiveData',
    })

    await expect(Utils.isAsyncValid(Validation.validateVerifiablePresentationV1)(vp)).resolves.toBeFalsy()
  })

  it('fails with invalid type', async () => {
    expect.assertions(1)

    const subjectDID = await generateDID()
    const issuerDID = await generateDID()

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: subjectDID.did,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      issuer: {
        did: issuerDID.did,
        keyId: '#primary',
        privateKey: issuerDID.primaryKey.getPrivateKeyString(),
        publicKey: issuerDID.primaryKey.getPublicKeyString(),
      },
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      revocation: {
        '@context': 'https://example.com',
        token: '1234',
      },
    })

    const vp = await buildVerifiablePresentation({
      didConfig: subjectDID,
      atomicCredentials: [atomicVC],
      token: EthUtils.generateNonce(),
      domain: 'https://bloom.co/receiveData',
    })

    await expect(
      Utils.isAsyncValid(Validation.validateVerifiablePresentationV1)({
        ...vp,
        type: [''],
      }),
    ).resolves.toBeFalsy()
  })

  it('fails with invalid verifiableCredential', async () => {
    expect.assertions(1)

    const subjectDID = await generateDID()
    const issuerDID = await generateDID()

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: subjectDID.did,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      issuer: {
        did: issuerDID.did,
        keyId: '#primary',
        privateKey: issuerDID.primaryKey.getPrivateKeyString(),
        publicKey: issuerDID.primaryKey.getPublicKeyString(),
      },
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      revocation: {
        '@context': 'https://example.com',
        token: '1234',
      },
    })

    const vp = await buildVerifiablePresentation({
      didConfig: subjectDID,
      atomicCredentials: [atomicVC],
      token: EthUtils.generateNonce(),
      domain: 'https://bloom.co/receiveData',
    })

    await expect(
      Utils.isAsyncValid(Validation.validateVerifiablePresentationV1)({
        ...vp,
        verifiableCredential: [
          {
            ...vp.verifiableCredential[0],
            type: [''],
          },
        ],
      }),
    ).resolves.toBeFalsy()
  })

  it('fails with invalid holder', async () => {
    expect.assertions(1)

    const subjectDID = await generateDID()
    const issuerDID = await generateDID()

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: subjectDID.did,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      issuer: {
        did: issuerDID.did,
        keyId: '#primary',
        privateKey: issuerDID.primaryKey.getPrivateKeyString(),
        publicKey: issuerDID.primaryKey.getPublicKeyString(),
      },
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      revocation: {
        '@context': 'https://example.com',
        token: '1234',
      },
    })

    const vp = await buildVerifiablePresentation({
      didConfig: subjectDID,
      atomicCredentials: [atomicVC],
      token: EthUtils.generateNonce(),
      domain: 'https://bloom.co/receiveData',
    })

    await expect(
      Utils.isAsyncValid(Validation.validateVerifiablePresentationV1)({
        ...vp,
        holder: '',
      }),
    ).resolves.toBeFalsy()
  })

  it('fails with invalid proof', async () => {
    expect.assertions(1)

    const subjectDID = await generateDID()
    const issuerDID = await generateDID()

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: subjectDID.did,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      issuer: {
        did: issuerDID.did,
        keyId: '#primary',
        privateKey: issuerDID.primaryKey.getPrivateKeyString(),
        publicKey: issuerDID.primaryKey.getPublicKeyString(),
      },
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      revocation: {
        '@context': 'https://example.com',
        token: '1234',
      },
    })

    const vp = await buildVerifiablePresentation({
      didConfig: subjectDID,
      atomicCredentials: [atomicVC],
      token: EthUtils.generateNonce(),
      domain: 'https://bloom.co/receiveData',
    })

    await expect(
      Utils.isAsyncValid(Validation.validateVerifiablePresentationV1)({
        ...vp,
        proof: {
          ...vp.proof,
          jws: '',
        },
      }),
    ).resolves.toBeFalsy()
  })
})
