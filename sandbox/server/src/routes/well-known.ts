import fastify from 'fastify'
import {DIDUtils} from '@bloomprotocol/attestations-common'
import dayjs from 'dayjs'
import {buildAtomicVCV1, buildAtomicVCSubjectV1} from '@bloomprotocol/issue-kit'

import {getEnv} from '@server/env'

const {MnemonicKeySystem} = require('@transmute/element-lib')

export const applyWellKnownRoutes = (app: fastify.FastifyInstance) => {
  app.get('/.well-known/did.json', async (_, reply) => {
    const mks = new MnemonicKeySystem(getEnv().issuerMnemonic)
    const primaryKey = await mks.getKeyForPurpose('primary', 0)
    const recoveryKey = await mks.getKeyForPurpose('recovery', 0)

    const did = await DIDUtils.createElemDID({primaryKey, recoveryKey})
    const didDoc = await DIDUtils.resolveDID(did)

    return reply.status(200).send(didDoc)
  })

  app.get('/.well-known/did-configuration.json', async (_, reply) => {
    const env = getEnv()
    const mks = new MnemonicKeySystem(env.issuerMnemonic)
    const primaryKey = await mks.getKeyForPurpose('primary', 0)
    const recoveryKey = await mks.getKeyForPurpose('recovery', 0)

    const did = await DIDUtils.createElemDID({primaryKey, recoveryKey})

    const credentialSubject = await buildAtomicVCSubjectV1({
      subject: did,
      data: {
        '@type': 'Thing',
        url: env.host,
      },
    })
    const vc = await buildAtomicVCV1({
      credentialSubject,
      type: 'DomainLinkageAssertion',
      issuer: {
        did: did,
        keyId: '#primary',
        privateKey: primaryKey.privateKey,
        publicKey: primaryKey.publicKey,
      },
      issuanceDate: dayjs.utc().toISOString(),
      revocation: {
        '@context': 'placeholder',
        token: '1234',
      },
    })

    return reply.status(200).send({
      '@context': 'https://identity.foundation/.well-known/contexts/did-configuration-v0.0.jsonld',
      entries: [{did, vc}],
    })
  })
}
