import fastify from 'fastify'
import S from 'fluent-schema'
import {validateVerifiablePresentationResponse} from '@bloomprotocol/verify-kit'

import {ShareRequest} from '@server/models'
import {shareCookieKey} from '@server/cookies'
import {sendNotification} from '@server/socket/sender'

export const applyShareRoutes = (app: fastify.FastifyInstance) => {
  app.post<fastify.DefaultQuery, fastify.DefaultParams, fastify.DefaultHeaders, {types: string[]; responseVersion: 'v0' | 'v1'}>(
    '/api/v1/share/create',
    {
      schema: {
        body: S.object()
          .prop('types', S.array().items(S.string()))
          .prop('responseVersion', S.enum(['v0', 'v1']))
          .required(['types', 'responseVersion']),
      },
    },
    async (req, reply) => {
      const request = await ShareRequest.create({requestedTypes: req.body.types, responseVersion: req.body.responseVersion})

      return reply.status(200).send({id: request.id})
    },
  )

  app.get<fastify.DefaultQuery, {id: string}>(
    '/api/v1/share/:id/get-config',
    {
      schema: {
        params: S.object()
          .prop('id', S.string().format('uuid'))
          .required(['id']),
      },
    },
    async (req, reply) => {
      const request = await ShareRequest.findOne({where: {id: req.params.id}})

      if (!request) return reply.status(404).send({})
      if (request.verifiableCredential) return reply.status(400).send({})

      return reply
        .status(200)
        .setCookie(shareCookieKey, req.params.id, {signed: true, path: '/'})
        .send({types: request.requestedTypes, responseVersion: request.responseVersion})
    },
  )

  app.get<fastify.DefaultQuery, {id: string}>(
    '/api/v1/share/:id/get-shared-data',
    {
      schema: {
        params: S.object()
          .prop('id', S.string().format('uuid'))
          .required(['id']),
      },
    },
    async (req, reply) => {
      const request = await ShareRequest.findOne({where: {id: req.params.id}})

      if (!request) return reply.status(404).send({})
      if (!request.verifiableCredential) return reply.status(404).send({})

      const {verifiableCredential} = request

      await request.destroy()

      return reply.status(200).send({verifiableCredential})
    },
  )

  app.post<{'share-kit-from': 'qr' | 'button'}>(
    '/api/v1/share/recieve-v0',
    {
      schema: {
        querystring: S.object()
          .prop('share-kit-from', S.enum(['qr', 'button']))
          .required(['share-kit-from']),
        body: S.object()
          .prop('token', S.string().format('uuid'))
          .required(['token']),
      },
    },
    async (req, reply) => {
      const request = await ShareRequest.findOne({where: {id: req.body.token}})
      if (!request) return reply.status(404).send({})

      const outcome = await validateVerifiablePresentationResponse(req.body, {version: 'v0'})
      if (outcome.kind === 'invalid') {
        return reply.status(400).send({message: 'Share payload could not be validated'})
      }

      const sharedTypes: string[] = outcome.data.verifiableCredential.map(vc => vc.type)
      const hasAllRequestedTypes = request.requestedTypes.every(requested => sharedTypes.includes(requested))

      if (!hasAllRequestedTypes) return reply.status(400).send({success: false})

      const {verifiableCredential} = outcome.data

      if (req.query['share-kit-from'] === 'qr') {
        sendNotification({
          recipient: req.body.token,
          type: 'notif/share-recieved',
          payload: JSON.stringify(verifiableCredential),
        })

        await request.destroy()
      } else {
        await request.update({verifiableCredential})
      }

      return reply.status(200).send({success: true})
    },
  )

  app.post<{'share-kit-from': 'qr' | 'button'}>(
    '/api/v1/share/recieve-v1',
    {
      schema: {
        querystring: S.object()
          .prop('share-kit-from', S.enum(['qr', 'button']))
          .required(['share-kit-from']),
        body: S.object()
          .prop(
            'proof',
            S.object()
              .prop(
                'metaData',
                S.object()
                  .prop('nonce')
                  .required(['nonce']),
              )
              .required(['metaData']),
          )
          .required(['proof']),
      },
    },
    async (req, reply) => {
      const request = await ShareRequest.findOne({where: {id: req.body.proof.metaData.nonce}})
      if (!request) return reply.status(404).send({})

      const outcome = await validateVerifiablePresentationResponse(req.body, {version: 'v1'})
      if (outcome.kind === 'invalid') {
        return reply.status(400).send({message: 'Share payload could not be validated'})
      }

      const sharedTypes: string[][] = outcome.data.verifiableCredential.map(vc => vc.type)
      const hasAllRequestedTypes = request.requestedTypes.every(requested => sharedTypes.some(types => types.includes(requested)))

      if (!hasAllRequestedTypes) return reply.status(400).send({success: false})

      const {verifiableCredential} = outcome.data

      if (req.query['share-kit-from'] === 'qr') {
        sendNotification({
          recipient: req.body.token,
          type: 'notif/share-recieved',
          payload: JSON.stringify(verifiableCredential),
        })

        await request.destroy()
      } else {
        await request.update({verifiableCredential})
      }

      return reply.status(200).send({success: true})
    },
  )
}
