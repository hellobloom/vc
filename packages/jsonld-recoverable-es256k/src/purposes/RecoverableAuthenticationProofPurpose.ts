const jsigs = require('jsonld-signatures')

const {AuthenticationProofPurpose} = jsigs.purposes

export {AuthenticationProofPurpose}

export class RecoverableAuthenticationProofPurpose extends AuthenticationProofPurpose {
  private addressKey: string
  private keyToAddress: (key: string) => string

  constructor({
    addressKey,
    keyToAddress,
    term = 'authentication',
    controller,
    challenge,
    date,
    domain,
    maxTimestampDelta = Infinity,
  }: {
    addressKey: string
    keyToAddress: (key: string) => string
    term?: string
    controller?: any
    date?: any
    maxTimestampDelta?: number
    challenge?: string
    domain?: string
  }) {
    super({term, controller, date, maxTimestampDelta, challenge, domain})

    this.addressKey = addressKey
    this.keyToAddress = keyToAddress
  }

  async validate(proof: any, {document, verificationMethod, documentLoader, expansionMap, suite}: any) {
    try {
      const superResult = await super.validate(proof, {verificationMethod, documentLoader, expansionMap})
      if (!superResult.valid) {
        throw superResult.error
      }

      const verifyData = await suite.createVerifyData({document, proof, documentLoader, expansionMap})

      const result = await suite.verifier.verify({
        data: Buffer.from(verifyData),
        signature: proof['jws'],
        recoveryId: proof['recoveryId'],
      })

      if (typeof result === 'string') {
        const recoveredAddress = this.keyToAddress(result)
        const {document: didDocument} = await documentLoader(verificationMethod.id)

        const addressMatches = didDocument[this.term].some((vm: any) => {
          return didDocument.publicKey.some((publicKey: any) => publicKey.id === vm && publicKey[this.addressKey] === recoveredAddress)
        })

        if (!addressMatches) {
          throw Error(`Recovered address (${recoveredAddress}) does not match the authorized public key's '${this.addressKey}' value`)
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
