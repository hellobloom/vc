import fastify from 'fastify'
import {uuid} from 'uuidv4'
import S from 'fluent-schema'
import {validateVerifiablePresentationResponse} from '@bloomprotocol/verify-kit'

import {ShareRequest} from '@server/models'
import {wsCookieKey} from '@server/cookies'
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
      const id = uuid()
      await ShareRequest.create({id, requestedTypes: req.body.types, responseVersion: req.body.responseVersion})

      return reply.status(200).send({id})
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
        .setCookie(wsCookieKey, req.params.id, {signed: true, path: '/'})
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

  app.post<{'share-kit-from': 'qr' | 'button'; responseVersion: 'v0' | 'v1'}>(
    '/api/v1/share/recieve',
    {
      schema: {
        querystring: S.object()
          .prop('share-kit-from', S.enum(['qr', 'button']))
          .prop('responseVersion', S.enum(['v0', 'v1']))
          .required(['share-kit-from', 'responseVersion']),
        body: S.object()
          .prop('token', S.string().format('uuid'))
          .required(['token']),
      },
    },
    async (req, reply) => {
      const request = await ShareRequest.findOne({where: {id: req.body.token}})
      if (!request) return reply.status(404).send({})

      if (req.query.responseVersion === 'v0') {
        console.log('recieve - v0')
        const outcome = await validateVerifiablePresentationResponse(req.body, {version: 'v0'})
        if (outcome.kind === 'invalid') {
          return reply.status(400).send({message: 'Share payload could not be validated'})
        }

        console.log('recieve - v0 - outcome', outcome)

        const sharedTypes: string[] = outcome.data.verifiableCredential.map(vc => vc.type)
        const hasAllRequestedTypes = request.requestedTypes.every(requested => sharedTypes.includes(requested))

        if (!hasAllRequestedTypes) return reply.status(400).send({success: false})

        const {verifiableCredential} = outcome.data

        if (req.query['share-kit-from'] === 'qr') {
          console.log('recieve - v0 - from qr')

          sendNotification({
            recipient: req.body.token,
            type: 'notif/share-recieved',
            payload: JSON.stringify(verifiableCredential),
          })

          await request.destroy()
        } else {
          console.log('recieve - v0 - from button')

          await request.update({verifiableCredential})
        }
      } else {
        console.log('recieve - v1')

        const outcome = await validateVerifiablePresentationResponse(req.body, {version: 'v1'})
        if (outcome.kind === 'invalid') {
          return reply.status(400).send({message: 'Share payload could not be validated'})
        }

        console.log('recieve - v1 - outcome', outcome)

        const sharedTypes: string[][] = outcome.data.verifiableCredential.map(vc => vc.type)
        const hasAllRequestedTypes = request.requestedTypes.every(requested => sharedTypes.some(types => types.includes(requested)))

        if (!hasAllRequestedTypes) return reply.status(400).send({success: false})

        const {verifiableCredential} = outcome.data

        if (req.query['share-kit-from'] === 'qr') {
          console.log('recieve - v1 - from qr')

          sendNotification({
            recipient: req.body.token,
            type: 'notif/share-recieved',
            payload: JSON.stringify(verifiableCredential),
          })

          await request.destroy()
        } else {
          console.log('recieve - v1 - from button')

          await request.update({verifiableCredential})
        }
      }

      console.log('recieve - before send')

      return reply.status(200).send({success: true})
    },
  )
}
