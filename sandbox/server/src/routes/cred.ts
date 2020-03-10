import fastify from 'fastify'
import S from 'fluent-schema'
import {buildAtomicVCV1, buildAtomicVCSubjectV1} from '@bloomprotocol/issue-kit'
import {DIDUtils} from '@bloomprotocol/attestations-common'
import dayjs from 'dayjs'

const {MnemonicKeySystem} = require('@transmute/element-lib')

import {IssuedCredential} from '@server/models'
import {claimCookieKey} from '@server/cookies'
import {sendNotification} from '@server/socket/sender'
import {getEnv} from '@server/env'

type DataMapping = {
  datum: {'@type': string}
  subject: string
}

export const applyCredRoutes = (app: fastify.FastifyInstance) => {
  app.post<
    fastify.DefaultQuery,
    fastify.DefaultParams,
    fastify.DefaultHeaders,
    {
      type: string
      data: DataMapping[]
    }
  >(
    '/api/v1/cred/create',
    {
      schema: {
        body: S.object()
          .prop('type', S.string())
          .prop(
            'data',
            S.array().items(
              S.object()
                .prop(
                  'datum',
                  S.object()
                    .prop('@type', S.string())
                    .required(['@type']),
                )
                .prop('subject', S.string())
                .required(['datum', 'subject']),
            ),
          )
          .required(['type', 'data']),
      },
    },
    async (req, reply) => {
      if (!req.body.data.every(({subject}) => subject === '' || DIDUtils.isValidDIDStructure(subject))) return reply.status(400).send({})

      const cred = await IssuedCredential.create({type: req.body.type, data: req.body.data, claimVersion: 'v1'})

      return reply.status(200).send({id: cred.id})
    },
  )

  app.get<{id: string}>(
    '/api/v1/cred/:id/get-config',
    {
      schema: {
        params: S.object()
          .prop('id', S.string().format('uuid'))
          .required(['id']),
      },
    },
    async (req, reply) => {
      const cred = await IssuedCredential.findOne({where: {id: req.params.id}})
      if (!cred) return reply.status(404).send({})

      return reply
        .status(200)
        .setCookie(claimCookieKey, req.params.id, {signed: true, path: '/'})
        .send({claimVersion: cred.claimVersion})
    },
  )

  app.get<fastify.DefaultQuery, {id: string}>(
    '/api/v1/cred/:id/get-claimed-vc',
    {
      schema: {
        params: S.object()
          .prop('id', S.string().format('uuid'))
          .required(['id']),
      },
    },
    async (req, reply) => {
      const cred = await IssuedCredential.findOne({where: {id: req.params.id}})

      if (!cred) return reply.status(404).send({})
      if (!cred.vc) return reply.status(404).send({})

      const {vc} = cred

      await cred.destroy()

      return reply.status(200).send({vc})
    },
  )

  app.post<{'claim-kit-from': 'qr' | 'button'}, {id: string}, fastify.DefaultHeaders, {subject: string}>(
    '/api/v1/cred/:id/claim-v1',
    {
      schema: {
        querystring: S.object()
          .prop('claim-kit-from', S.enum(['qr', 'button']))
          .required(['claim-kit-from']),
        params: S.object()
          .prop('id', S.string().format('uuid'))
          .required(['id']),
        body: S.object()
          .prop('subject', S.string())
          .required(['subject']),
      },
    },
    async (req, reply) => {
      if (!DIDUtils.isValidDIDStructure(req.body.subject)) {
        return reply.status(400).send({})
      }

      const cred = await IssuedCredential.findOne({where: {id: req.params.id}})
      if (!cred) return reply.status(404).send({})
      if (cred.claimed) return reply.status(400).send({})

      try {
        const credentialSubject = await Promise.all(
          cred.data.map(async ({datum, subject}) => {
            return await buildAtomicVCSubjectV1({
              data: JSON.parse(JSON.stringify(datum).replace('{{claimer}}', subject)),
              subject: subject || req.body.subject,
            })
          }),
        )

        const mks = new MnemonicKeySystem(getEnv().issuerMnemonic)
        const primaryKey = await mks.getKeyForPurpose('primary', 0)
        const recoveryKey = await mks.getKeyForPurpose('recovery', 0)

        const did = await DIDUtils.createElemDID({primaryKey, recoveryKey})

        const vc = await buildAtomicVCV1({
          credentialSubject,
          type: [cred.type],
          issuanceDate: dayjs.utc().toISOString(),
          expirationDate: dayjs
            .utc()
            .add(2, 'month')
            .toISOString(),
          issuer: {
            did,
            keyId: '#primary',
            privateKey: primaryKey.privateKey,
            publicKey: primaryKey.publicKey,
          },
          revocation: {
            '@context': 'placeholder',
            token: '1234',
          },
        })

        if (req.query['claim-kit-from'] === 'qr') {
          sendNotification({
            recipient: req.params.id,
            type: 'notif/cred-claimed',
            payload: JSON.stringify(vc),
          })

          await cred.destroy()
        } else {
          await cred.update({claimed: true, vc})
        }

        return reply.status(200).send({vc})
      } catch {
        return reply.status(400).send({})
      }
    },
  )
}
