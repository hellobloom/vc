import {EthUtils, DIDUtils, Utils, VCV1, BaseVPV1, VCV1Subject} from '@bloomprotocol/vc-common'
import {buildVCV1Subject, buildVCV1} from '@bloomprotocol/issue-kit'
import {EcdsaSecp256k1KeyClass2019, EcdsaSecp256k1Signature2019} from '@transmute/lds-ecdsa-secp256k1-2019'
import {keyUtils} from '@transmute/es256k-jws-ts'

const uuid = () => 'abcdef-abcdef-abcdef-abcdef'

const {MnemonicKeySystem} = require('@transmute/element-lib')
const jsigs = require('jsonld-signatures')

import * as Validation from '../../../../src/validate/v1/structure'

const {AuthenticationProofPurpose} = jsigs.purposes

type DID = {
  did: string
  primaryKey: Key
  recoveryKey: Key
}

type Key = {
  publicKey: string
  privateKey: string
}

const generateDID = async (): Promise<DID> => {
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

const genGenericVC = (issuer: DID, credentialSubject: VCV1Subject<any>) =>
  buildVCV1({
    id: `urn:uuid:${uuid()}`,
    credentialSubject,
    type: ['CustomCredential'],
    holder: {
      id: credentialSubject.id!,
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
      id: '1234',
    },
  })

type Holder = {
  did: string
  keyId: string
  publicKey: string
  privateKey: string
}

const buildVerifiablePresentation = async ({
  holder,
  atomicCredentials,
  token,
  domain,
}: {
  atomicCredentials: VCV1[]
  token: string
  domain: string
  holder: Holder
}): Promise<BaseVPV1> => {
  const didDocument = await DIDUtils.resolveDID(holder.did)
  const publicKey = didDocument.publicKey.find(({id}) => id.endsWith(holder.keyId))

  if (!publicKey) throw new Error('Cannot find primary key')

  const unsignedVP: Omit<BaseVPV1<VCV1>, 'proof'> = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiablePresentation'],
    verifiableCredential: atomicCredentials,
    holder: holder.did,
  }

  const vp: BaseVPV1 = await jsigs.sign(unsignedVP, {
    suite: new EcdsaSecp256k1Signature2019({
      key: new EcdsaSecp256k1KeyClass2019({
        id: publicKey.id,
        controller: holder.did,
        privateKeyJwk: await keyUtils.privateJWKFromPrivateKeyHex(
          holder.privateKey.startsWith('0x') ? holder.privateKey.substring(2) : holder.privateKey,
        ),
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

    const {did} = await generateDID()

    const credentialSubject = await buildVCV1Subject({
      subject: did,
      data: {'@type': 'Thing'},
    })

    expect(Utils.isValid(Validation.validateCredentialSubject)(credentialSubject)).toBeTruthy()
  })

  it('fails with empty subject', async () => {
    expect.assertions(1)

    const {did} = await generateDID()

    const credentialSubject = await buildVCV1Subject({
      subject: did,
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

    const {did} = await generateDID()

    const credentialSubject = await buildVCV1Subject({
      subject: did,
      data: {'@type': ''},
    })

    expect(Utils.isValid(Validation.validateCredentialSubject)(credentialSubject)).toBeFalsy()
  })
})

describe('Validation.validateCredentialRevocation', () => {
  it('passes', () => {
    expect(Utils.isValid(Validation.validateCredentialRevocation)({id: 'https://example.com'})).toBeTruthy()
  })

  it('fails with empty context', () => {
    expect(Utils.isValid(Validation.validateCredentialRevocation)({id: ''})).toBeFalsy()
  })
})

describe('Validation.validateCredentialProof', () => {
  it('passes', async () => {
    expect.assertions(1)

    const {did: subjectDID} = await generateDID()
    const issuer = await generateDID()

    const credentialSubject = await buildVCV1Subject({
      subject: subjectDID,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await genGenericVC(issuer, credentialSubject)

    expect(Utils.isValid(Validation.validateCredentialProof)(atomicVC.proof)).toBeTruthy()
  })

  it('fails with invalid type', async () => {
    expect.assertions(1)

    const {did: subjectDID} = await generateDID()
    const issuer = await generateDID()

    const credentialSubject = await buildVCV1Subject({
      subject: subjectDID,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await genGenericVC(issuer, credentialSubject)

    expect(
      Utils.isValid(Validation.validateCredentialProof)({
        ...atomicVC.proof,
        type: '',
      }),
    ).toBeFalsy()
  })

  it('fails with invalid created', async () => {
    expect.assertions(1)

    const {did: subjectDID} = await generateDID()
    const issuer = await generateDID()

    const credentialSubject = await buildVCV1Subject({
      subject: subjectDID,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await genGenericVC(issuer, credentialSubject)

    expect(
      Utils.isValid(Validation.validateCredentialProof)({
        ...atomicVC.proof,
        created: '2016-02-01',
      }),
    ).toBeFalsy()
  })

  it('fails with invalid proofPurpose', async () => {
    expect.assertions(1)

    const {did: subjectDID} = await generateDID()
    const issuer = await generateDID()

    const credentialSubject = await buildVCV1Subject({
      subject: subjectDID,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await genGenericVC(issuer, credentialSubject)

    expect(
      Utils.isValid(Validation.validateCredentialProof)({
        ...atomicVC.proof,
        proofPurpose: '',
      }),
    ).toBeFalsy()
  })

  it('fails with invalid verificationMethod', async () => {
    expect.assertions(1)

    const {did: subjectDID} = await generateDID()
    const issuer = await generateDID()

    const credentialSubject = await buildVCV1Subject({
      subject: subjectDID,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await genGenericVC(issuer, credentialSubject)

    expect(
      Utils.isValid(Validation.validateCredentialProof)({
        ...atomicVC.proof,
        verificationMethod: '',
      }),
    ).toBeFalsy()
  })

  it('fails with invalid jws', async () => {
    expect.assertions(1)

    const {did: subjectDID} = await generateDID()
    const issuer = await generateDID()

    const credentialSubject = await buildVCV1Subject({
      subject: subjectDID,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await genGenericVC(issuer, credentialSubject)

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

    const {did: subjectDID} = await generateDID()
    const issuer = await generateDID()

    const credentialSubject = await buildVCV1Subject({
      subject: subjectDID,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await genGenericVC(issuer, credentialSubject)

    await expect(Utils.isAsyncValid(Validation.validateVerifiableCredential)(atomicVC)).resolves.toBeTruthy()
  })

  it('passes wihtout an expiration date', async () => {
    expect.assertions(1)

    const {did: subjectDID} = await generateDID()
    const issuer = await generateDID()

    const credentialSubject = await buildVCV1Subject({
      subject: subjectDID,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildVCV1({
      id: `urn:uuid:${uuid()}`,
      credentialSubject,
      type: ['CustomCredential'],
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
      revocation: {
        id: '1234',
      },
    })

    await expect(Utils.isAsyncValid(Validation.validateVerifiableCredential)(atomicVC)).resolves.toBeTruthy()
  })

  it('fails with invalid @context', async () => {
    expect.assertions(1)

    const {did: subjectDID} = await generateDID()
    const issuer = await generateDID()

    const credentialSubject = await buildVCV1Subject({
      subject: subjectDID,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildVCV1({
      id: `urn:uuid:${uuid()}`,
      credentialSubject,
      type: ['CustomCredential'],
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
      revocation: {
        id: '1234',
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

    const {did: subjectDID} = await generateDID()
    const issuer = await generateDID()

    const credentialSubject = await buildVCV1Subject({
      subject: subjectDID,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildVCV1({
      id: `urn:uuid:${uuid()}`,
      credentialSubject,
      type: ['CustomCredential'],
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
      revocation: {
        id: '1234',
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

    const {did: subjectDID} = await generateDID()
    const issuer = await generateDID()

    const credentialSubject = await buildVCV1Subject({
      subject: subjectDID,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildVCV1({
      id: `urn:uuid:${uuid()}`,
      credentialSubject,
      type: ['CustomCredential'],
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
      revocation: {
        id: '1234',
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

    const {did: subjectDID} = await generateDID()
    const issuer = await generateDID()

    const credentialSubject = await buildVCV1Subject({
      subject: subjectDID,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildVCV1({
      id: `urn:uuid:${uuid()}`,
      credentialSubject,
      type: ['CustomCredential'],
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
      revocation: {
        id: '1234',
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

    const {did: subjectDID} = await generateDID()
    const issuer = await generateDID()

    const credentialSubject = await buildVCV1Subject({
      subject: subjectDID,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildVCV1({
      id: `urn:uuid:${uuid()}`,
      credentialSubject,
      type: ['CustomCredential'],
      holder: {
        id: subjectDID,
      },
      issuer: {
        did: issuer.did,
        keyId: '#primary',
        privateKey: issuer.primaryKey.privateKey,
        publicKey: issuer.primaryKey.publicKey,
      },
      issuanceDate: '2016-02-01',
      revocation: {
        id: '1234',
      },
    })

    await expect(Utils.isAsyncValid(Validation.validateVerifiableCredential)(atomicVC)).resolves.toBeFalsy()
  })

  it('fails with invalid expirationDate', async () => {
    expect.assertions(1)

    const {did: subjectDID} = await generateDID()
    const issuer = await generateDID()

    const credentialSubject = await buildVCV1Subject({
      subject: subjectDID,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await genGenericVC(issuer, credentialSubject)

    await expect(Utils.isAsyncValid(Validation.validateVerifiableCredential)(atomicVC)).resolves.toBeFalsy()
  })

  it('fails with invalid credentialSubject', async () => {
    expect.assertions(1)

    const {did: subjectDID} = await generateDID()
    const issuer = await generateDID()

    const credentialSubject = await buildVCV1Subject({
      subject: subjectDID,
      data: {'@type': ''},
    })

    const atomicVC = await genGenericVC(issuer, credentialSubject)

    await expect(Utils.isAsyncValid(Validation.validateVerifiableCredential)(atomicVC)).resolves.toBeFalsy()
  })

  it('fails with invalid revocation', async () => {
    expect.assertions(1)

    const {did: subjectDID} = await generateDID()
    const issuer = await generateDID()

    const credentialSubject = await buildVCV1Subject({
      subject: subjectDID,
      data: {'@type': ''},
    })

    const atomicVC = await genGenericVC(issuer, credentialSubject)

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

    const {did: subjectDID} = await generateDID()
    const issuer = await generateDID()

    const credentialSubject = await buildVCV1Subject({
      subject: subjectDID,
      data: {'@type': ''},
    })

    const atomicVC = await genGenericVC(issuer, credentialSubject)

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

    const {did: subjectDID} = await generateDID()
    const issuer = await generateDID()

    const credentialSubject = await buildVCV1Subject({
      subject: subjectDID,
      data: {'@type': ''},
    })

    const atomicVC = await genGenericVC(issuer, credentialSubject)

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

    const subject = await generateDID()
    const issuer = await generateDID()

    const credentialSubject = await buildVCV1Subject({
      subject: subject.did,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await genGenericVC(issuer, credentialSubject)

    const vp = await buildVerifiablePresentation({
      holder: {
        keyId: '#primary',
        did: subject.did,
        privateKey: subject.primaryKey.privateKey,
        publicKey: subject.primaryKey.publicKey,
      },
      atomicCredentials: [atomicVC],
      token: EthUtils.generateNonce(),
      domain: 'https://bloom.co/receiveData',
    })

    await expect(Utils.isAsyncValid(Validation.validateVerifiablePresentationV1)(vp)).resolves.toBeTruthy()
  })

  it('fails when subject and sharer differ', async () => {
    expect.assertions(1)

    const {did: subjectDID} = await generateDID()
    const invalidSubject = await generateDID()
    const issuer = await generateDID()

    const credentialSubject = await buildVCV1Subject({
      subject: subjectDID,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await genGenericVC(issuer, credentialSubject)

    const vp = await buildVerifiablePresentation({
      holder: {
        keyId: '#primary',
        did: invalidSubject.did,
        privateKey: invalidSubject.primaryKey.privateKey,
        publicKey: invalidSubject.primaryKey.publicKey,
      },
      atomicCredentials: [atomicVC],
      token: EthUtils.generateNonce(),
      domain: 'https://bloom.co/receiveData',
    })

    await expect(Utils.isAsyncValid(Validation.validateVerifiablePresentationV1)(vp)).resolves.toBeFalsy()
  })

  it('fails with invalid type', async () => {
    expect.assertions(1)

    const subject = await generateDID()
    const issuer = await generateDID()

    const credentialSubject = await buildVCV1Subject({
      subject: subject.did,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await genGenericVC(issuer, credentialSubject)

    const vp = await buildVerifiablePresentation({
      holder: {
        keyId: '#primary',
        did: subject.did,
        privateKey: subject.primaryKey.privateKey,
        publicKey: subject.primaryKey.publicKey,
      },
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

    const subject = await generateDID()
    const issuer = await generateDID()

    const credentialSubject = await buildVCV1Subject({
      subject: subject.did,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await genGenericVC(issuer, credentialSubject)

    const vp = await buildVerifiablePresentation({
      holder: {
        keyId: '#primary',
        did: subject.did,
        privateKey: subject.primaryKey.privateKey,
        publicKey: subject.primaryKey.publicKey,
      },
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

    const subject = await generateDID()
    const issuer = await generateDID()

    const credentialSubject = await buildVCV1Subject({
      subject: subject.did,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await genGenericVC(issuer, credentialSubject)

    const vp = await buildVerifiablePresentation({
      holder: {
        keyId: '#primary',
        did: subject.did,
        privateKey: subject.primaryKey.privateKey,
        publicKey: subject.primaryKey.publicKey,
      },
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

    const subject = await generateDID()
    const issuer = await generateDID()

    const credentialSubject = await buildVCV1Subject({
      subject: subject.did,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await genGenericVC(issuer, credentialSubject)

    const vp = await buildVerifiablePresentation({
      holder: {
        keyId: '#primary',
        did: subject.did,
        privateKey: subject.primaryKey.privateKey,
        publicKey: subject.primaryKey.publicKey,
      },
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
