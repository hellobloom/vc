import {EthUtils, DIDUtils, Utils, AtomicVCV1, VPV1} from '@bloomprotocol/attestations-common'
import {buildAtomicVCSubjectV1, buildAtomicVCV1} from '@bloomprotocol/issue-kit'
import {
  RecoverableEcdsaSecp256k1KeyClass2019,
  RecoverableEcdsaSecp256k1Signature2019,
  Purposes,
} from '@bloomprotocol/jsonld-recoverable-es256k'
import EthWallet from 'ethereumjs-wallet'
import {keyUtils} from '@transmute/es256k-jws-ts'

const jsigs = require('jsonld-signatures')
const {RecoverableAuthenticationProofPurpose} = Purposes

import * as Validation from '../../../../src/validate/v1/structure'

const issuerWallet = EthWallet.fromPrivateKey(Buffer.from('efca4cdd31923b50f4214af5d2ae10e7ac45a5019e9431cc195482d707485378', 'hex'))
const issuerPrivKey = issuerWallet.getPrivateKey()

const bobWallet = EthWallet.fromPrivateKey(Buffer.from('c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3', 'hex'))

const aliceWallet = EthWallet.fromPrivateKey(Buffer.from('ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f', 'hex'))

const buildVerifiablePresentation = async ({
  wallet,
  atomicCredentials,
  token,
  domain,
}: {
  atomicCredentials: AtomicVCV1[]
  token: string
  domain: string
  wallet: EthWallet
}): Promise<VPV1> => {
  const didDocument = await DIDUtils.resolveDID(`did:ethr:${wallet.getAddressString()}`)
  const publicKey = didDocument.publicKey[0]

  const unsignedVP: Omit<VPV1<AtomicVCV1>, 'proof'> = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiablePresentation'],
    verifiableCredential: atomicCredentials,
    holder: `did:ethr:${wallet.getAddressString()}`,
  }

  const privateKeyJwk = await keyUtils.privateJWKFromPrivateKeyHex(wallet.getPrivateKeyString().replace('0x', ''))

  const vp: VPV1 = await jsigs.sign(unsignedVP, {
    suite: new RecoverableEcdsaSecp256k1Signature2019({
      key: new RecoverableEcdsaSecp256k1KeyClass2019({
        id: publicKey.id,
        controller: publicKey.owner,
        privateKeyJwk,
      }),
    }),
    documentLoader: DIDUtils.documentLoader,
    purpose: new RecoverableAuthenticationProofPurpose({
      addressKey: 'ethereumAddress',
      keyToAddress: key => EthWallet.fromPublicKey(Buffer.from(key.substr(2), 'hex')).getAddressString(),
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

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: `did:ethr:${bobWallet.getAddressString()}`,
      data: {'@type': 'Thing'},
    })

    await expect(Utils.isValid(Validation.validateCredentialSubject)(credentialSubject)).toBeTruthy()
  })

  it('fails with empty subject', async () => {
    expect.assertions(1)

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: `did:ethr:${bobWallet.getAddressString()}`,
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

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: `did:ethr:${bobWallet.getAddressString()}`,
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

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: `did:ethr:${bobWallet.getAddressString()}`,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      // TODO: use elem DID method here
      issuer: '',
      keyId: '',
      privateKey: issuerPrivKey,
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

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: `did:ethr:${bobWallet.getAddressString()}`,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      // TODO: use elem DID method here
      issuer: '',
      keyId: '',
      privateKey: issuerPrivKey,
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

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: `did:ethr:${bobWallet.getAddressString()}`,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      // TODO: use elem DID method here
      issuer: '',
      keyId: '',
      privateKey: issuerPrivKey,
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

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: `did:ethr:${bobWallet.getAddressString()}`,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      // TODO: use elem DID method here
      issuer: '',
      keyId: '',
      privateKey: issuerPrivKey,
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

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: `did:ethr:${bobWallet.getAddressString()}`,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      // TODO: use elem DID method here
      issuer: '',
      keyId: '',
      privateKey: issuerPrivKey,
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

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: `did:ethr:${bobWallet.getAddressString()}`,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      // TODO: use elem DID method here
      issuer: '',
      keyId: '',
      privateKey: issuerPrivKey,
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

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: `did:ethr:${bobWallet.getAddressString()}`,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      // TODO: use elem DID method here
      issuer: '',
      keyId: '',
      privateKey: issuerPrivKey,
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

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: `did:ethr:${bobWallet.getAddressString()}`,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      // TODO: use elem DID method here
      issuer: '',
      keyId: '',
      privateKey: issuerPrivKey,
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

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: `did:ethr:${bobWallet.getAddressString()}`,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      // TODO: use elem DID method here
      issuer: '',
      keyId: '',
      privateKey: issuerPrivKey,
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

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: `did:ethr:${bobWallet.getAddressString()}`,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      // TODO: use elem DID method here
      issuer: '',
      keyId: '',
      privateKey: issuerPrivKey,
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

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: `did:ethr:${bobWallet.getAddressString()}`,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      // TODO: use elem DID method here
      issuer: '',
      keyId: '',
      privateKey: issuerPrivKey,
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

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: `did:ethr:${bobWallet.getAddressString()}`,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      // TODO: use elem DID method here
      issuer: '',
      keyId: '',
      privateKey: issuerPrivKey,
      issuanceDate: '2016-02-01T00:00:00.000Z',
      revocation: {
        '@context': 'https://example.com',
        token: '1234',
      },
    })

    await expect(
      Utils.isAsyncValid(Validation.validateVerifiableCredential)({
        ...atomicVC,
        issuer: issuerWallet.getAddressString(),
      }),
    ).resolves.toBeFalsy()
  })

  it('fails with invalid issuanceDate', async () => {
    expect.assertions(1)

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: `did:ethr:${bobWallet.getAddressString()}`,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      // TODO: use elem DID method here
      issuer: '',
      keyId: '',
      privateKey: issuerPrivKey,
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

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: `did:ethr:${bobWallet.getAddressString()}`,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      // TODO: use elem DID method here
      issuer: '',
      keyId: '',
      privateKey: issuerPrivKey,
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

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: `did:ethr:${bobWallet.getAddressString()}`,
      data: {'@type': ''},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      // TODO: use elem DID method here
      issuer: '',
      keyId: '',
      privateKey: issuerPrivKey,
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

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: `did:ethr:${bobWallet.getAddressString()}`,
      data: {'@type': ''},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      // TODO: use elem DID method here
      issuer: '',
      keyId: '',
      privateKey: issuerPrivKey,
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

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: `did:ethr:${bobWallet.getAddressString()}`,
      data: {'@type': ''},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      // TODO: use elem DID method here
      issuer: '',
      keyId: '',
      privateKey: issuerPrivKey,
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

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: `did:ethr:${bobWallet.getAddressString()}`,
      data: {'@type': ''},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      // TODO: use elem DID method here
      issuer: '',
      keyId: '',
      privateKey: issuerPrivKey,
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

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: `did:ethr:${bobWallet.getAddressString()}`,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      // TODO: use elem DID method here
      issuer: '',
      keyId: '',
      privateKey: issuerPrivKey,
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      revocation: {
        '@context': 'https://example.com',
        token: '1234',
      },
    })

    const vp = await buildVerifiablePresentation({
      wallet: bobWallet,
      atomicCredentials: [atomicVC],
      token: EthUtils.generateNonce(),
      domain: 'https://bloom.co/receiveData',
    })

    await expect(Utils.isAsyncValid(Validation.validateVerifiablePresentationV1)(vp)).resolves.toBeTruthy()
  })

  it('fails when subject and sharer differ', async () => {
    expect.assertions(1)

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: `did:ethr:${bobWallet.getAddressString()}`,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      // TODO: use elem DID method here
      issuer: '',
      keyId: '',
      privateKey: issuerPrivKey,
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      revocation: {
        '@context': 'https://example.com',
        token: '1234',
      },
    })

    const vp = await buildVerifiablePresentation({
      wallet: aliceWallet,
      atomicCredentials: [atomicVC],
      token: EthUtils.generateNonce(),
      domain: 'https://bloom.co/receiveData',
    })

    await expect(Utils.isAsyncValid(Validation.validateVerifiablePresentationV1)(vp)).resolves.toBeFalsy()
  })

  it('fails with invalid type', async () => {
    expect.assertions(1)

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: `did:ethr:${bobWallet.getAddressString()}`,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      // TODO: use elem DID method here
      issuer: '',
      keyId: '',
      privateKey: issuerPrivKey,
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      revocation: {
        '@context': 'https://example.com',
        token: '1234',
      },
    })

    const vp = await buildVerifiablePresentation({
      wallet: bobWallet,
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

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: `did:ethr:${bobWallet.getAddressString()}`,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      // TODO: use elem DID method here
      issuer: '',
      keyId: '',
      privateKey: issuerPrivKey,
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      revocation: {
        '@context': 'https://example.com',
        token: '1234',
      },
    })

    const vp = await buildVerifiablePresentation({
      wallet: bobWallet,
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

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: `did:ethr:${bobWallet.getAddressString()}`,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      // TODO: use elem DID method here
      issuer: '',
      keyId: '',
      privateKey: issuerPrivKey,
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      revocation: {
        '@context': 'https://example.com',
        token: '1234',
      },
    })

    const vp = await buildVerifiablePresentation({
      wallet: bobWallet,
      atomicCredentials: [atomicVC],
      token: EthUtils.generateNonce(),
      domain: 'https://bloom.co/receiveData',
    })

    await expect(
      Utils.isAsyncValid(Validation.validateVerifiablePresentationV1)({
        ...vp,
        holder: bobWallet.getAddressString(),
      }),
    ).resolves.toBeFalsy()
  })

  it('fails with invalid proof', async () => {
    expect.assertions(1)

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: `did:ethr:${bobWallet.getAddressString()}`,
      data: {'@type': 'Thing'},
    })

    const atomicVC = await buildAtomicVCV1({
      credentialSubject,
      type: ['CustomCredential'],
      // TODO: use elem DID method here
      issuer: '',
      keyId: '',
      privateKey: issuerPrivKey,
      issuanceDate: '2016-02-01T00:00:00.000Z',
      expirationDate: '2018-02-01T00:00:00.000Z',
      revocation: {
        '@context': 'https://example.com',
        token: '1234',
      },
    })

    const vp = await buildVerifiablePresentation({
      wallet: bobWallet,
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
