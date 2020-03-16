import fastify from 'fastify'
import {DIDUtils} from '@bloomprotocol/vc-common'
import dayjs from 'dayjs'
import {buildVCV1, buildVCV1Subject} from '@bloomprotocol/issue-kit'

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

    const url = env.host ? env.host : `localhost:${env.port}`

    const credentialSubject = await buildVCV1Subject({
      subject: did,
      data: {
        '@type': 'Thing',
        url,
      },
    })
    const vc = await buildVCV1({
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
