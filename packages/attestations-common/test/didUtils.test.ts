const {op, func, MnemonicKeySystem} = require('@transmute/element-lib')
import base64url from 'base64url'

import * as DIDUtils from '../src/didUtils'

describe('DIDUtils', () => {
  let baseElemDID: string
  let elemDIDWithInitialState: string
  let invalidElemDID: string
  let validEthrDID: string
  let invalidDID: string

  beforeAll(async (done: () => void) => {
    const mks = new MnemonicKeySystem(MnemonicKeySystem.generateMnemonic())
    const primaryKey = await mks.getKeyForPurpose('primary', 0)
    const recoveryKey = await mks.getKeyForPurpose('recovery', 0)
    const didDocumentModel = op.getDidDocumentModel(primaryKey.publicKey, recoveryKey.publicKey)
    const createPayload = await op.getCreatePayload(didDocumentModel, primaryKey)
    const didUniqueSuffix = func.getDidUniqueSuffix(createPayload)

    baseElemDID = `did:elem:${didUniqueSuffix}`
    elemDIDWithInitialState = `${baseElemDID};elem:initial-state=${base64url.encode(JSON.stringify(createPayload))}`
    invalidElemDID = baseElemDID
    validEthrDID = 'did:ethr:0x...'
    invalidDID = 'invalid:did:elme:testing'

    done()
  })

  describe('isValidDIDStructure', () => {
    it('validates when the did starts with did:elem', () => {
      expect(DIDUtils.isValidDIDStructure(elemDIDWithInitialState)).toBeTruthy()
    })

    it("fails when the did starts with did:elem but doesn't contain an initial state", () => {
      expect(DIDUtils.isValidDIDStructure(invalidElemDID)).toBeFalsy()
    })

    it('fails when the did starts with did:ethr', () => {
      expect(DIDUtils.isValidDIDStructure(validEthrDID)).toBeFalsy()
    })

    it("fails when the did doesn't start with did", () => {
      expect(DIDUtils.isValidDIDStructure(invalidDID)).toBeFalsy()
    })
  })

  describe('resolveDID', () => {
    describe('resolves', () => {
      it('a valid elem DID', async () => {
        expect.assertions(1)

        const document = await DIDUtils.resolveDID(elemDIDWithInitialState)

        expect(document.id).toEqual(baseElemDID)
      })
    })

    describe("doesn't resolve", () => {
      it('an invalid elem DID', async () => {
        expect.assertions(1)

        expect(DIDUtils.resolveDID(invalidElemDID)).rejects.toThrow()
      })

      it('a valid ethr DID', async () => {
        expect.assertions(1)

        expect(DIDUtils.resolveDID(validEthrDID)).rejects.toThrow()
      })
    })
  })
})
