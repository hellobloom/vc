import base64url from 'base64url'
import {RecoveryId} from 'bitcoin-ts'
import {keyUtils} from '@transmute/es256k-jws-ts'

import * as JWS from './JWS'

/** A secp256k1 linked data key */
interface IRecoverableEcdsaSecp256k1KeyClass2019Options {
  /** used to match verificationMethod or kid in VC Data Model. */
  id?: string

  /** Linked data key type, always RecoverableEcdsaSecp256k1VerificationKey2019 */
  type?: string
  /** controller for linked data proofs */
  controller: string

  /** JWK private key */
  privateKeyJwk?: any

  /** JWK public key */
  publicKeyJwk?: any
}

export interface IVerifier {
  /** function for verifying a signature */
  verify: (data: any) => Promise<string | false>
}

export interface ISigner {
  /** function for creating a signature */
  sign: (data: any) => Promise<{jws: string; recoveryId: RecoveryId}>
}

/**
 * @ignore
 * Returns an object with an async sign function.
 * The sign function is bound to the KeyPair
 * and then returned by the KeyPair's signer method.
 * @param {RecoverableEcdsaSecp256k1KeyClass2019} key - An RecoverableEcdsaSecp256k1KeyClass2019.
 *
 * @returns {{sign: Function}} An object with an async function sign
 * using the private key passed in.
 */
const joseSignerFactory = (key: IRecoverableEcdsaSecp256k1KeyClass2019Options): ISigner => {
  if (!key.privateKeyJwk) {
    return {
      async sign(_: any) {
        throw new Error('No private key to sign with.')
      },
    }
  }

  return {
    async sign({data}: any): Promise<{jws: string; recoveryId: RecoveryId}> {
      const header = {
        alg: 'ES256K',
        b64: false,
        crit: ['b64'],
      }
      const toBeSigned = Buffer.from(data.buffer, data.byteOffset, data.length)
      return JWS.signDetached(toBeSigned, key.privateKeyJwk, header)
    },
  }
}

/**
 * @ignore
 * Returns an object with an async verify function.
 * The verify function is bound to the KeyPair
 * and then returned by the KeyPair's verifier method.
 * @param {RecoverableEcdsaSecp256k1KeyClass2019} key - An RecoverableEcdsaSecp256k1KeyClass2019.
 *
 * @returns {{verify: Function}} An async verifier specific
 * to the key passed in.
 */
const joseVerifierFactory = (_: IRecoverableEcdsaSecp256k1KeyClass2019Options): IVerifier => {
  return {
    async verify({data, signature, recoveryId}: any) {
      const alg = 'ES256K'
      const type = 'RecoverableEcdsaSecp256k1VerificationKey2019'
      const [encodedHeader] = signature.split('..')
      let header
      try {
        header = JSON.parse(base64url.decode(encodedHeader))
      } catch (e) {
        throw new Error('Could not parse JWS header; ' + e)
      }
      if (!(header && typeof header === 'object')) {
        throw new Error('Invalid JWS header.')
      }

      // confirm header matches all expectations
      if (
        !(
          header.alg === alg &&
          header.b64 === false &&
          Array.isArray(header.crit) &&
          header.crit.length === 1 &&
          header.crit[0] === 'b64'
        ) &&
        Object.keys(header).length === 3
      ) {
        throw new Error(`Invalid JWS header parameters for ${type}.`)
      }

      const payload = Buffer.from(data.buffer, data.byteOffset, data.length)

      try {
        return await JWS.verifyDetached(signature, payload, recoveryId)
      } catch (e) {
        return false
      }
    },
  }
}

export class RecoverableEcdsaSecp256k1KeyClass2019 implements IRecoverableEcdsaSecp256k1KeyClass2019Options {
  /**
   * Used to support importing of public keys from resolvers.
   */
  public static async from(options: IRecoverableEcdsaSecp256k1KeyClass2019Options) {
    return new RecoverableEcdsaSecp256k1KeyClass2019(options)
  }

  /**
   * Generates and returns a public key fingerprint using https://tools.ietf.org/html/rfc7638
   *
   * @param {string} publicKeyJwk - The jwk encoded public key material.
   *
   * @returns {string} The fingerprint.
   */
  public static fingerprintFromPublicKey({publicKeyJwk}: IRecoverableEcdsaSecp256k1KeyClass2019Options) {
    const temp = {...publicKeyJwk}
    delete temp.kid
    return keyUtils.getKid(temp)
  }

  /** function for verifying a signature */
  public id: string
  public type: string
  public controller: string
  public privateKeyJwk: any
  public publicKeyJwk: any

  public alg: string

  /**
   * @param {KeyPairOptions} options - The options to use.
   * @param {string} options.id - The key ID.
   * @param {string} options.controller - The key controller.
   * @param {string} options.publicKeyJwk - The JWK encoded Public Key.
   * @param {string} options.privateKeyJwk - The JWK Private Key.
   * @param {string} options.alg - The JWS alg for this key.
   */
  constructor(options: IRecoverableEcdsaSecp256k1KeyClass2019Options) {
    this.controller = options.controller
    this.type = options.type || 'RecoverableEcdsaSecp256k1VerificationKey2019'
    this.privateKeyJwk = options.privateKeyJwk
    this.publicKeyJwk = options.publicKeyJwk
    this.alg = 'ES256K'

    if (this.publicKeyJwk === undefined) {
      this.publicKeyJwk = {...this.privateKeyJwk}
      delete this.publicKeyJwk.d
    }
    this.id = options.id || this.controller + '#' + this.fingerprint()
  }

  //   /**
  //    * Returns the JWK encoded public key.
  //    *
  //    * @returns {string} The JWK encoded public key.
  //    */
  //   get publicKey() {
  //     return this.publicKeyJwk;
  //   }

  //   /**
  //    * Returns the JWK encoded private key.
  //    *
  //    * @returns {string} The JWK encoded private key.
  //    */
  //   get privateKey() {
  //     return this.privateKeyJwk;
  //   }

  /**
   * Returns a signer object for use with jsonld-signatures.
   *
   * @returns {{sign: Function}} A signer for the json-ld block.
   */
  public signer(): ISigner {
    return joseSignerFactory(this)
  }

  /**
   * Returns a verifier object for use with jsonld-signatures.
   *
   * @returns {{verify: Function}} Used to verify jsonld-signatures.
   */
  public verifier(): IVerifier {
    return joseVerifierFactory(this)
  }

  /**
   * Adds a public key base to a public key node.
   *
   * @param {Object} publicKeyNode - The public key node in a jsonld-signature.
   * @param {string} publicKeyNode.publicKeyJwk - JWK Public Key for
   *   jsonld-signatures.
   *
   * @returns {Object} A PublicKeyNode in a block.
   */
  public addEncodedPublicKey(publicKeyNode: any) {
    publicKeyNode.publicKeyJwk = this.publicKeyJwk
    return publicKeyNode
  }

  /**
   * Generates and returns a public key fingerprint using https://tools.ietf.org/html/rfc7638
   *
   * @returns {string} The fingerprint.
   */
  public fingerprint(): string {
    const temp = {...this.publicKeyJwk}
    delete temp.kid
    return keyUtils.getKid(temp)
  }

  //   /**
  //    * Tests whether the fingerprint was generated from a given key pair.
  //    *
  //    * @param {string} fingerprint - A JWK public key.
  //    *
  //    * @returns {Object} An object indicating valid is true or false.
  //    */
  //   verifyFingerprint(/*fingerprint*/) {
  //     // TODO: implement
  //     throw new Error('`verifyFingerprint` API is not implemented.');
  //   }

  /**
   * Contains the public key for the KeyPair
   * and other information that json-ld Signatures can use to form a proof.
   * @param {Object} [options={}] - Needs either a controller or owner.
   * @param {string} [options.controller=this.controller]  - DID of the
   * person/entity controlling this key pair.
   *
   * @returns {Object} A public node with
   * information used in verification methods by signatures.
   */
  public publicNode() {
    const controller = this.controller
    const publicNode: any = {
      id: this.id,
      type: this.type,
    }
    if (controller) {
      publicNode.controller = controller
    }
    this.addEncodedPublicKey(publicNode) // Subclass-specific
    return publicNode
  }
}
