import fastify from 'fastify'
import {uuid} from 'uuidv4'
import {validateVerifiablePresentationResponse} from '@bloomprotocol/verify-kit'

export const applyShareRoutes = (app: fastify.FastifyInstance) => {
  app.post<fastify.DefaultQuery, fastify.DefaultParams, fastify.DefaultHeaders, {types: string[]}>(
    '/api/v1/share/create',
    async (req, reply) => {
      const id = uuid()

      // TODO: create request row in Request table with the provided types

      return reply.status(200).send({id})
    },
  )

  app.get<fastify.DefaultQuery, {id: string}>('/api/v1/share/:id/get-types', async (req, reply) => {
    // TODO: Get the types associated with the share request with the given id

    return reply.status(200).send({types: []})
  })

  app.get<fastify.DefaultQuery, {id: string}>('/api/v1/share/:id/get-shared-data', async (req, reply) => {
    // TODO: Get the shared data's types associated with the share request with the given id

    return reply.status(200).send({types: []})
  })

  app.get<{'share-kit-from': 'qr' | 'button'}>('/api/v1/share/recieve', async (req, reply) => {
    const outcome = await validateVerifiablePresentationResponse(req.body, {version: 'v0'})

    if (outcome.kind === 'invalid') {
      return reply.status(400).send({message: 'Share payload could not be validated'})
    }

    // TODO: Update the the Request row with the shared types
    // TODO: Send a WS notif if req.query["share-kit-from"] === 'qr'

    return reply.status(200).send({success: true})
  })
}
