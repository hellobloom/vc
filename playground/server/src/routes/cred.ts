import fastify from 'fastify'
import S from 'fluent-schema'
import {buildClaimNodeV1, buildSelectivelyDisclosableVCV1} from '@bloomprotocol/issue-kit'

import {IssuedCredential} from '@server/models'
import {claimCookieKey} from '@server/cookies'
import {sendNotification} from '@server/socket/sender'

export const applyCredRoutes = (app: fastify.FastifyInstance) => {
  app.post<
    fastify.DefaultQuery,
    fastify.DefaultParams,
    fastify.DefaultHeaders,
    {
      claimNodes: {type: string; provider: string; version: string; data: {}}[]
    }
  >(
    '/api/v1/cred/create',
    {
      schema: {
        body: S.object()
          .prop(
            'claimNodes',
            S.array().items(
              S.object()
                .prop('type', S.string())
                .prop('provider', S.string())
                .prop('version', S.string())
                .prop('data', S.object())
                .required(['type', 'provider', 'version', 'data']),
            ),
          )
          .required(['claimNodes']),
      },
    },
    async (req, reply) => {
      const cred = await IssuedCredential.create({claimNodes: req.body.claimNodes, claimVersion: 'v1'})

      return reply.status(200).send({id: cred.id})
    },
  )

  app.post<{id: string}>(
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

  app.post(
    '/api/v1/cred/:id/claim-v1',
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

      const claimNodes = cred.claimNodes.map(node =>
        buildClaimNodeV1({
          dataStr: JSON.stringify(node.data),
          type: node.type as any,
          provider: node.provider,
          version: node.version,
        }),
      )

      const vc = buildSelectivelyDisclosableVCV1({
        claimNodes,
        subject: '',
        issuanceDate: '',
        expirationDate: '',
        privateKey: Buffer.from([]),
      })

      if (req.query['share-kit-from'] === 'qr') {
        sendNotification({
          recipient: req.body.token,
          type: 'notif/cred-claimed',
          payload: JSON.stringify(vc),
        })

        await cred.destroy()
      } else {
        await cred.update({})
      }

      return reply.status(200).send({})
    },
  )
}
