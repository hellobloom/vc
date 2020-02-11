import EthWallet from 'ethereumjs-wallet'

const jsigs = require('jsonld-signatures')

const {AssertionProofPurpose} = jsigs.purposes

export {AssertionProofPurpose}

export class RecoverableAssertionProofPurpose extends AssertionProofPurpose {
  constructor({
    term = 'assertionMethod',
    controller,
    date,
    maxTimestampDelta = Infinity,
  }: {term?: string; controller?: any; date?: any; maxTimestampDelta?: number} = {}) {
    super({term, controller, date, maxTimestampDelta})
  }

  async validate(proof: any, {document, verificationMethod, documentLoader, expansionMap, suite}: any) {
    try {
      const superResult = await super.validate(proof, {verificationMethod, documentLoader, expansionMap})
      if (!superResult.valid) {
        throw superResult.error
      }

      const verifyData = await suite.createVerifyData({document, proof, documentLoader, expansionMap})
      console.log('validate', {verifyData})
      const result = await suite.verifier.verify({
        data: Buffer.from(verifyData),
        signature: proof['jws'],
        recoveryId: proof['recoveryId'],
      })

      if (typeof result === 'string') {
        console.log({verifyResult: result})
        const recoveredAddress = EthWallet.fromPublicKey(Buffer.from(result.substr(2), 'hex')).getAddressString()
        const {document: didDocument} = await documentLoader(verificationMethod.id)
        console.log({didDocument})
        const addressMatches = didDocument[this.term].some((vm: any) => {
          return didDocument.publicKey.some((publicKey: any) => publicKey.id === vm && publicKey['ethereumAddress'] === recoveredAddress)
        })

        if (!addressMatches) {
          throw Error(`Recovered address (${recoveredAddress}) does not match the authorized public key's 'ethereumAddress' value`)
        }

        return {valid: true}
      } else {
        throw Error('Could not verify signature')
      }
    } catch (error) {
      return {valid: false, error}
    }
  }
}
