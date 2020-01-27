import fastify from 'fastify'
import S from 'fluent-schema'
import {buildClaimNodeV1, buildSelectivelyDisclosableVCV1, buildSelectivelyDisclosableBatchVCV1} from '@bloomprotocol/issue-kit'
import {SelectivelyDisclosableVCV1} from '@bloomprotocol/attestations-common'

import {IssuedCredential} from '@server/models'
import {claimCookieKey} from '@server/cookies'
import {sendNotification} from '@server/socket/sender'
import {getEnv} from '@server/env'

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

  app.get<fastify.DefaultQuery, {id: string}>(
    '/api/v1/cred/:id/get-claimed-data',
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
      if (!cred.credential) return reply.status(404).send({})
      if (!cred.batchCredential) return reply.status(404).send({})

      const {credential, batchCredential} = cred

      await cred.destroy()

      return reply.status(200).send({credential, batchCredential})
    },
  )

  app.post<{'issue-kit-from': 'qr' | 'button'}, {id: string}, fastify.DefaultHeaders, {subject: string}>(
    '/api/v1/cred/:id/claim-v1',
    {
      schema: {
        querystring: S.object()
          .prop('issue-kit-from', S.enum(['qr', 'button']))
          .required(['issue-kit-from']),
        params: S.object()
          .prop('id', S.string().format('uuid'))
          .required(['id']),
      },
    },
    async (req, reply) => {
      const cred = await IssuedCredential.findOne({where: {id: req.params.id}})
      if (!cred) return reply.status(404).send({})
      if (cred.claimed) return reply.status(400).send({})

      const claimNodes = cred.claimNodes.map(node =>
        buildClaimNodeV1({
          dataStr: JSON.stringify(node.data),
          type: node.type as any,
          provider: node.provider,
          version: node.version,
        }),
      )

      const vc = await buildSelectivelyDisclosableVCV1({
        claimNodes,
        subjectDID: '',
        issuanceDate: '',
        expirationDate: '',
        privateKey: Buffer.from(''),
      })

      await cred.update({claimed: true})

      const env = getEnv()

      return reply.status(200).send({
        credential: vc,
        batch_url: `${env.appServerUrl || env.host}/api/v1/cred/${req.params.id}/claim-v1/batch?issue-kit-from${
          req.query['issue-kit-from']
        }`,
      })
    },
  )

  app.post<
    {'issue-kit-from': 'qr' | 'button'},
    {id: string},
    fastify.DefaultHeaders,
    {
      credential: SelectivelyDisclosableVCV1
      subjectSignature: string
    }
  >(
    '/api/v1/cred/:id/claim-v1/batch',
    {
      schema: {
        querystring: S.object()
          .prop('issue-kit-from', S.enum(['qr', 'button']))
          .required(['issue-kit-from']),
        params: S.object()
          .prop('id', S.string().format('uuid'))
          .required(['id']),
        body: S.object()
          .prop(
            'credential',
            S.object()
              .prop('@context', S.array().items(S.string()))
              .prop('id', S.string())
              .prop('type', S.array().items(S.string()))
              .prop('issuer', S.string())
              .prop('issuanceDate', S.string())
              .prop('expirateDate', S.string())
              .prop(
                'credentialSubject',
                S.object()
                  .prop('id', S.string())
                  .prop(
                    'claimNodes',
                    S.array().items(
                      S.object()
                        .prop(
                          'claimNode',
                          S.object()
                            .prop(
                              'data',
                              S.object()
                                .prop('data', S.string())
                                .prop('nonce', S.string())
                                .prop('version', S.string())
                                .required(['data', 'nonce', 'version']),
                            )
                            .prop(
                              'type',
                              S.object()
                                .prop('type', S.string())
                                .prop('provider', S.string())
                                .prop('nonce', S.string())
                                .required(['type', 'nonce']),
                            )
                            .prop('aux', S.string())
                            .required(['data', 'type', 'aux']),
                        )
                        .prop('issuer', S.string())
                        .prop('issuerSignature', S.string())
                        .required(['claimNode', 'issuer', 'issuerSignature']),
                    ),
                  )
                  .required(['id', 'claimNodes']),
              )
              .prop(
                'proof',
                S.object()
                  .prop('issuerSignature', S.string())
                  .prop('layer2Hash', S.string())
                  .prop('checksumSignature', S.string())
                  .prop('paddingNodes', S.array().items(S.string()))
                  .prop('rootHash', S.string())
                  .prop('rootHashNonce', S.string())
                  .required(['issuerSignature', 'layer2Hash', 'checksumSignature', 'paddingNodes', 'rootHash', 'rootHashNonce']),
              )
              .required(['@context', 'id', 'type', 'issuer', 'issuanceDate', 'credentialSubject', 'proof']),
          )
          .prop('subjectSignature', S.string())
          .required(['credential', 'subjectSignature']),
      },
    },
    async (req, reply) => {
      const cred = await IssuedCredential.findOne({where: {id: req.params.id}})
      if (!cred) return reply.status(404).send({})

      const batchVc = await buildSelectivelyDisclosableBatchVCV1({
        credential: req.body.credential,
        privateKey: Buffer.from([]),
        contractAddress: '',
        subjectSignature: req.body.subjectSignature,
        requestNonce: '',
      })

      if (req.query['issue-kit-from'] === 'qr') {
        sendNotification({
          recipient: req.params.id,
          type: 'notif/cred-claimed',
          payload: JSON.stringify({batchCredential: batchVc, credential: req.body.credential}),
        })

        await cred.destroy()
      } else {
        await cred.update({batchCredential: batchVc, credential: req.body.credential})
      }

      return reply.status(200).send({})
    },
  )
}
