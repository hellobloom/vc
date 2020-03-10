const {op, func, MnemonicKeySystem} = require('@transmute/element-lib')
import base64url from 'base64url'

import * as DIDUtils from '../src/didUtils'

const didConfigs = {
  valid: {
    mnemonic: 'van arena midnight draw weasel gap vocal mirror iron jeans nation neutral',
    did:
      'did:elem:EiAhUmDryvY5jUgg085iTzq0pqI77haDo_tvVObiajXmuQ;elem:initial-state=eyJwcm90ZWN0ZWQiOiJleUp2Y0dWeVlYUnBiMjRpT2lKamNtVmhkR1VpTENKcmFXUWlPaUlqY0hKcGJXRnllU0lzSW1Gc1p5STZJa1ZUTWpVMlN5SjkiLCJwYXlsb2FkIjoiZXlKQVkyOXVkR1Y0ZENJNkltaDBkSEJ6T2k4dmR6TnBaQzV2Y21jdmMyVmpkWEpwZEhrdmRqSWlMQ0p3ZFdKc2FXTkxaWGtpT2x0N0ltbGtJam9pSTNCeWFXMWhjbmtpTENKMWMyRm5aU0k2SW5OcFoyNXBibWNpTENKMGVYQmxJam9pVTJWamNESTFObXN4Vm1WeWFXWnBZMkYwYVc5dVMyVjVNakF4T0NJc0luQjFZbXhwWTB0bGVVaGxlQ0k2SWpBeU9UUTJZalV4TXprNE1ERTNaVEU0TXpsbU1UQmhNV0kzTldNeU5EWmxZamN5WVRRMk56a3lNMkpoTW1VNU5HVTBNbU0xWTJJMFlXTmxaRE00WXpreU55SjlMSHNpYVdRaU9pSWpjbVZqYjNabGNua2lMQ0oxYzJGblpTSTZJbkpsWTI5MlpYSjVJaXdpZEhsd1pTSTZJbE5sWTNBeU5UWnJNVlpsY21sbWFXTmhkR2x2Ymt0bGVUSXdNVGdpTENKd2RXSnNhV05MWlhsSVpYZ2lPaUl3TTJJd1pqTTBZVGhsTjJKaU9ETTJNekkxTXpRMk1UazVOR0V6TldWaVlXVTBOV0l4TXpFeVlUUmtNakUzWWpReE5HRTNZV1F6T1RVM09XTXdZek5qWmpNaWZWMHNJbUYxZEdobGJuUnBZMkYwYVc5dUlqcGJJaU53Y21sdFlYSjVJbDBzSW1GemMyVnlkR2x2YmsxbGRHaHZaQ0k2V3lJamNISnBiV0Z5ZVNKZGZRIiwic2lnbmF0dXJlIjoiS3h1cWs2djBuRUVBX2dEbjlFZ1Y3cFpSejlBTVp5dlVHMmJ4dXB6ZWp1eHFSMy1zandndml3TWJpV04xd3AxU3F2bWlydkw0ZklGbkI1aDUtLW01V0EifQ',
    didDoc: {
      '@context': 'https://w3id.org/security/v2',
      publicKey: [
        {
          id:
            'did:elem:EiAhUmDryvY5jUgg085iTzq0pqI77haDo_tvVObiajXmuQ;elem:initial-state=eyJwcm90ZWN0ZWQiOiJleUp2Y0dWeVlYUnBiMjRpT2lKamNtVmhkR1VpTENKcmFXUWlPaUlqY0hKcGJXRnllU0lzSW1Gc1p5STZJa1ZUTWpVMlN5SjkiLCJwYXlsb2FkIjoiZXlKQVkyOXVkR1Y0ZENJNkltaDBkSEJ6T2k4dmR6TnBaQzV2Y21jdmMyVmpkWEpwZEhrdmRqSWlMQ0p3ZFdKc2FXTkxaWGtpT2x0N0ltbGtJam9pSTNCeWFXMWhjbmtpTENKMWMyRm5aU0k2SW5OcFoyNXBibWNpTENKMGVYQmxJam9pVTJWamNESTFObXN4Vm1WeWFXWnBZMkYwYVc5dVMyVjVNakF4T0NJc0luQjFZbXhwWTB0bGVVaGxlQ0k2SWpBeU9UUTJZalV4TXprNE1ERTNaVEU0TXpsbU1UQmhNV0kzTldNeU5EWmxZamN5WVRRMk56a3lNMkpoTW1VNU5HVTBNbU0xWTJJMFlXTmxaRE00WXpreU55SjlMSHNpYVdRaU9pSWpjbVZqYjNabGNua2lMQ0oxYzJGblpTSTZJbkpsWTI5MlpYSjVJaXdpZEhsd1pTSTZJbE5sWTNBeU5UWnJNVlpsY21sbWFXTmhkR2x2Ymt0bGVUSXdNVGdpTENKd2RXSnNhV05MWlhsSVpYZ2lPaUl3TTJJd1pqTTBZVGhsTjJKaU9ETTJNekkxTXpRMk1UazVOR0V6TldWaVlXVTBOV0l4TXpFeVlUUmtNakUzWWpReE5HRTNZV1F6T1RVM09XTXdZek5qWmpNaWZWMHNJbUYxZEdobGJuUnBZMkYwYVc5dUlqcGJJaU53Y21sdFlYSjVJbDBzSW1GemMyVnlkR2x2YmsxbGRHaHZaQ0k2V3lJamNISnBiV0Z5ZVNKZGZRIiwic2lnbmF0dXJlIjoiS3h1cWs2djBuRUVBX2dEbjlFZ1Y3cFpSejlBTVp5dlVHMmJ4dXB6ZWp1eHFSMy1zandndml3TWJpV04xd3AxU3F2bWlydkw0ZklGbkI1aDUtLW01V0EifQ#primary',
          usage: 'signing',
          type: 'Secp256k1VerificationKey2018',
          publicKeyHex: '02946b51398017e1839f10a1b75c246eb72a467923ba2e94e42c5cb4aced38c927',
        },
        {
          id:
            'did:elem:EiAhUmDryvY5jUgg085iTzq0pqI77haDo_tvVObiajXmuQ;elem:initial-state=eyJwcm90ZWN0ZWQiOiJleUp2Y0dWeVlYUnBiMjRpT2lKamNtVmhkR1VpTENKcmFXUWlPaUlqY0hKcGJXRnllU0lzSW1Gc1p5STZJa1ZUTWpVMlN5SjkiLCJwYXlsb2FkIjoiZXlKQVkyOXVkR1Y0ZENJNkltaDBkSEJ6T2k4dmR6TnBaQzV2Y21jdmMyVmpkWEpwZEhrdmRqSWlMQ0p3ZFdKc2FXTkxaWGtpT2x0N0ltbGtJam9pSTNCeWFXMWhjbmtpTENKMWMyRm5aU0k2SW5OcFoyNXBibWNpTENKMGVYQmxJam9pVTJWamNESTFObXN4Vm1WeWFXWnBZMkYwYVc5dVMyVjVNakF4T0NJc0luQjFZbXhwWTB0bGVVaGxlQ0k2SWpBeU9UUTJZalV4TXprNE1ERTNaVEU0TXpsbU1UQmhNV0kzTldNeU5EWmxZamN5WVRRMk56a3lNMkpoTW1VNU5HVTBNbU0xWTJJMFlXTmxaRE00WXpreU55SjlMSHNpYVdRaU9pSWpjbVZqYjNabGNua2lMQ0oxYzJGblpTSTZJbkpsWTI5MlpYSjVJaXdpZEhsd1pTSTZJbE5sWTNBeU5UWnJNVlpsY21sbWFXTmhkR2x2Ymt0bGVUSXdNVGdpTENKd2RXSnNhV05MWlhsSVpYZ2lPaUl3TTJJd1pqTTBZVGhsTjJKaU9ETTJNekkxTXpRMk1UazVOR0V6TldWaVlXVTBOV0l4TXpFeVlUUmtNakUzWWpReE5HRTNZV1F6T1RVM09XTXdZek5qWmpNaWZWMHNJbUYxZEdobGJuUnBZMkYwYVc5dUlqcGJJaU53Y21sdFlYSjVJbDBzSW1GemMyVnlkR2x2YmsxbGRHaHZaQ0k2V3lJamNISnBiV0Z5ZVNKZGZRIiwic2lnbmF0dXJlIjoiS3h1cWs2djBuRUVBX2dEbjlFZ1Y3cFpSejlBTVp5dlVHMmJ4dXB6ZWp1eHFSMy1zandndml3TWJpV04xd3AxU3F2bWlydkw0ZklGbkI1aDUtLW01V0EifQ#recovery',
          usage: 'recovery',
          type: 'Secp256k1VerificationKey2018',
          publicKeyHex: '03b0f34a8e7bb8363253461994a35ebae45b1312a4d217b414a7ad39579c0c3cf3',
        },
      ],
      authentication: [
        'did:elem:EiAhUmDryvY5jUgg085iTzq0pqI77haDo_tvVObiajXmuQ;elem:initial-state=eyJwcm90ZWN0ZWQiOiJleUp2Y0dWeVlYUnBiMjRpT2lKamNtVmhkR1VpTENKcmFXUWlPaUlqY0hKcGJXRnllU0lzSW1Gc1p5STZJa1ZUTWpVMlN5SjkiLCJwYXlsb2FkIjoiZXlKQVkyOXVkR1Y0ZENJNkltaDBkSEJ6T2k4dmR6TnBaQzV2Y21jdmMyVmpkWEpwZEhrdmRqSWlMQ0p3ZFdKc2FXTkxaWGtpT2x0N0ltbGtJam9pSTNCeWFXMWhjbmtpTENKMWMyRm5aU0k2SW5OcFoyNXBibWNpTENKMGVYQmxJam9pVTJWamNESTFObXN4Vm1WeWFXWnBZMkYwYVc5dVMyVjVNakF4T0NJc0luQjFZbXhwWTB0bGVVaGxlQ0k2SWpBeU9UUTJZalV4TXprNE1ERTNaVEU0TXpsbU1UQmhNV0kzTldNeU5EWmxZamN5WVRRMk56a3lNMkpoTW1VNU5HVTBNbU0xWTJJMFlXTmxaRE00WXpreU55SjlMSHNpYVdRaU9pSWpjbVZqYjNabGNua2lMQ0oxYzJGblpTSTZJbkpsWTI5MlpYSjVJaXdpZEhsd1pTSTZJbE5sWTNBeU5UWnJNVlpsY21sbWFXTmhkR2x2Ymt0bGVUSXdNVGdpTENKd2RXSnNhV05MWlhsSVpYZ2lPaUl3TTJJd1pqTTBZVGhsTjJKaU9ETTJNekkxTXpRMk1UazVOR0V6TldWaVlXVTBOV0l4TXpFeVlUUmtNakUzWWpReE5HRTNZV1F6T1RVM09XTXdZek5qWmpNaWZWMHNJbUYxZEdobGJuUnBZMkYwYVc5dUlqcGJJaU53Y21sdFlYSjVJbDBzSW1GemMyVnlkR2x2YmsxbGRHaHZaQ0k2V3lJamNISnBiV0Z5ZVNKZGZRIiwic2lnbmF0dXJlIjoiS3h1cWs2djBuRUVBX2dEbjlFZ1Y3cFpSejlBTVp5dlVHMmJ4dXB6ZWp1eHFSMy1zandndml3TWJpV04xd3AxU3F2bWlydkw0ZklGbkI1aDUtLW01V0EifQ#primary',
      ],
      assertionMethod: [
        'did:elem:EiAhUmDryvY5jUgg085iTzq0pqI77haDo_tvVObiajXmuQ;elem:initial-state=eyJwcm90ZWN0ZWQiOiJleUp2Y0dWeVlYUnBiMjRpT2lKamNtVmhkR1VpTENKcmFXUWlPaUlqY0hKcGJXRnllU0lzSW1Gc1p5STZJa1ZUTWpVMlN5SjkiLCJwYXlsb2FkIjoiZXlKQVkyOXVkR1Y0ZENJNkltaDBkSEJ6T2k4dmR6TnBaQzV2Y21jdmMyVmpkWEpwZEhrdmRqSWlMQ0p3ZFdKc2FXTkxaWGtpT2x0N0ltbGtJam9pSTNCeWFXMWhjbmtpTENKMWMyRm5aU0k2SW5OcFoyNXBibWNpTENKMGVYQmxJam9pVTJWamNESTFObXN4Vm1WeWFXWnBZMkYwYVc5dVMyVjVNakF4T0NJc0luQjFZbXhwWTB0bGVVaGxlQ0k2SWpBeU9UUTJZalV4TXprNE1ERTNaVEU0TXpsbU1UQmhNV0kzTldNeU5EWmxZamN5WVRRMk56a3lNMkpoTW1VNU5HVTBNbU0xWTJJMFlXTmxaRE00WXpreU55SjlMSHNpYVdRaU9pSWpjbVZqYjNabGNua2lMQ0oxYzJGblpTSTZJbkpsWTI5MlpYSjVJaXdpZEhsd1pTSTZJbE5sWTNBeU5UWnJNVlpsY21sbWFXTmhkR2x2Ymt0bGVUSXdNVGdpTENKd2RXSnNhV05MWlhsSVpYZ2lPaUl3TTJJd1pqTTBZVGhsTjJKaU9ETTJNekkxTXpRMk1UazVOR0V6TldWaVlXVTBOV0l4TXpFeVlUUmtNakUzWWpReE5HRTNZV1F6T1RVM09XTXdZek5qWmpNaWZWMHNJbUYxZEdobGJuUnBZMkYwYVc5dUlqcGJJaU53Y21sdFlYSjVJbDBzSW1GemMyVnlkR2x2YmsxbGRHaHZaQ0k2V3lJamNISnBiV0Z5ZVNKZGZRIiwic2lnbmF0dXJlIjoiS3h1cWs2djBuRUVBX2dEbjlFZ1Y3cFpSejlBTVp5dlVHMmJ4dXB6ZWp1eHFSMy1zandndml3TWJpV04xd3AxU3F2bWlydkw0ZklGbkI1aDUtLW01V0EifQ#primary',
      ],
      id:
        'did:elem:EiAhUmDryvY5jUgg085iTzq0pqI77haDo_tvVObiajXmuQ;elem:initial-state=eyJwcm90ZWN0ZWQiOiJleUp2Y0dWeVlYUnBiMjRpT2lKamNtVmhkR1VpTENKcmFXUWlPaUlqY0hKcGJXRnllU0lzSW1Gc1p5STZJa1ZUTWpVMlN5SjkiLCJwYXlsb2FkIjoiZXlKQVkyOXVkR1Y0ZENJNkltaDBkSEJ6T2k4dmR6TnBaQzV2Y21jdmMyVmpkWEpwZEhrdmRqSWlMQ0p3ZFdKc2FXTkxaWGtpT2x0N0ltbGtJam9pSTNCeWFXMWhjbmtpTENKMWMyRm5aU0k2SW5OcFoyNXBibWNpTENKMGVYQmxJam9pVTJWamNESTFObXN4Vm1WeWFXWnBZMkYwYVc5dVMyVjVNakF4T0NJc0luQjFZbXhwWTB0bGVVaGxlQ0k2SWpBeU9UUTJZalV4TXprNE1ERTNaVEU0TXpsbU1UQmhNV0kzTldNeU5EWmxZamN5WVRRMk56a3lNMkpoTW1VNU5HVTBNbU0xWTJJMFlXTmxaRE00WXpreU55SjlMSHNpYVdRaU9pSWpjbVZqYjNabGNua2lMQ0oxYzJGblpTSTZJbkpsWTI5MlpYSjVJaXdpZEhsd1pTSTZJbE5sWTNBeU5UWnJNVlpsY21sbWFXTmhkR2x2Ymt0bGVUSXdNVGdpTENKd2RXSnNhV05MWlhsSVpYZ2lPaUl3TTJJd1pqTTBZVGhsTjJKaU9ETTJNekkxTXpRMk1UazVOR0V6TldWaVlXVTBOV0l4TXpFeVlUUmtNakUzWWpReE5HRTNZV1F6T1RVM09XTXdZek5qWmpNaWZWMHNJbUYxZEdobGJuUnBZMkYwYVc5dUlqcGJJaU53Y21sdFlYSjVJbDBzSW1GemMyVnlkR2x2YmsxbGRHaHZaQ0k2V3lJamNISnBiV0Z5ZVNKZGZRIiwic2lnbmF0dXJlIjoiS3h1cWs2djBuRUVBX2dEbjlFZ1Y3cFpSejlBTVp5dlVHMmJ4dXB6ZWp1eHFSMy1zandndml3TWJpV04xd3AxU3F2bWlydkw0ZklGbkI1aDUtLW01V0EifQ',
    },
  },
}

describe('DIDUtils', () => {
  let primaryKey: {privateKey: string; publicKey: string}
  let recoveryKey: {privateKey: string; publicKey: string}
  let baseElemDID: string
  let elemDIDWithInitialState: string
  let invalidElemDID: string
  let validEthrDID: string
  let invalidDID: string

  beforeAll(async (done: () => void) => {
    const mks = new MnemonicKeySystem('van arena midnight draw weasel gap vocal mirror iron jeans nation neutral')
    primaryKey = await mks.getKeyForPurpose('primary', 0)
    recoveryKey = await mks.getKeyForPurpose('recovery', 0)
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

  describe('createElemDID', () => {
    it('works', async () => {
      expect.assertions(1)

      const {mnemonic, did: expectedDID} = didConfigs.valid

      const mks = new MnemonicKeySystem(mnemonic)
      const primaryKey = await mks.getKeyForPurpose('primary', 0)
      const recoveryKey = await mks.getKeyForPurpose('recovery', 0)

      const did = await DIDUtils.createElemDID({primaryKey, recoveryKey})

      expect(did).toEqual(expectedDID)
    })
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

        const {did, didDoc: expectedDIDDoc} = didConfigs.valid

        const didDoc = await DIDUtils.resolveDID(did)

        expect(didDoc).toEqual(expectedDIDDoc)
      })
    })

    describe("doesn't resolve", () => {
      it('a elem DID without an initial-state param', async () => {
        expect.assertions(1)

        const {did} = didConfigs.valid

        expect(DIDUtils.resolveDID(did.split(';')[0])).rejects.toThrow()
      })

      it('throws with invalid initial-state param', async () => {
        expect.assertions(1)

        const {did} = didConfigs.valid

        expect(DIDUtils.resolveDID(`${did}X`)).rejects.toThrow()
      })

      it('throws when given a non-elem DID', async () => {
        expect.assertions(1)

        expect(DIDUtils.resolveDID('did:invalid:1234')).rejects.toThrow()
      })

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
