import fastify from 'fastify'
import {uuid} from 'uuidv4'
import S from 'fluent-schema'
import {validateVerifiablePresentationResponse} from '@bloomprotocol/verify-kit'

import {ShareRequest} from '@server/models'
import {wsCookieKey} from '@server/cookies'
import {sendNotification} from '@server/socket/sender'

export const applyShareRoutes = (app: fastify.FastifyInstance) => {
  app.post<fastify.DefaultQuery, fastify.DefaultParams, fastify.DefaultHeaders, {types: string[]}>(
    '/api/v1/share/create',
    {
      schema: {
        body: S.object()
          .prop('types', S.array().items(S.string()))
          .required(['types']),
      },
    },
    async (req, reply) => {
      const id = uuid()
      await ShareRequest.create({id, requestedTypes: req.body.types})

      return reply.status(200).send({id})
    },
  )

  app.get<fastify.DefaultQuery, {id: string}>(
    '/api/v1/share/:id/get-types',
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
      if (request.sharedTypes) return reply.status(400).send({})

      return reply
        .status(200)
        .setCookie(wsCookieKey, req.params.id, {signed: true, path: '/'})
        .send({types: request.requestedTypes})
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
      if (!request.sharedTypes) return reply.status(404).send({})

      return reply.status(200).send({types: request.sharedTypes})
    },
  )

  app.post<{'share-kit-from': 'qr' | 'button'}>(
    '/api/v1/share/recieve',
    {
      schema: {
        body: S.object()
          .prop('token', S.string().format('uuid'))
          .required(['token']),
      },
    },
    async (req, reply) => {
      const request = await ShareRequest.findOne({where: {id: req.body.token}})

      console.log({request})

      if (!request) return reply.status(404).send({})

      const outcome = await validateVerifiablePresentationResponse(req.body, {version: 'v0'})

      console.log({outcome})

      if (outcome.kind === 'invalid') {
        return reply.status(400).send({message: 'Share payload could not be validated'})
      }

      const sharedTypes: string[] = outcome.data.verifiableCredential.map(vc => vc.type)
      const hasAllRequestedTypes = request.requestedTypes.every(requested => sharedTypes.includes(requested))

      console.log({hasAllRequestedTypes})

      if (!hasAllRequestedTypes) return reply.status(400).send({success: false})

      await request.update({sharedTypes: outcome.data.verifiableCredential.map(vc => vc.type)})

      sendNotification({
        recipient: req.body.token,
        type: 'notif/share-recieved',
        payload: JSON.stringify(sharedTypes),
      })

      return reply.status(200).send({success: true})
    },
  )
}
