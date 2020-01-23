import fastify from 'fastify'
// import {uuid} from 'uuidv4'
import S from 'fluent-schema'

// import {ShareRequest} from '@server/models'
// import {wsCookieKey} from '@server/cookies'
// import {sendNotification} from '@server/socket/sender'

export const applyCredRoutes = (app: fastify.FastifyInstance) => {
  app.post('/api/v1/cred/create', (req, reply) => {
    reply.status(200).send({})
  })

  app.post(
    '/api/v1/cred/:id/claim/',
    {
      schema: {
        params: S.object()
          .prop('id', S.string().format('uuid'))
          .required(['id']),
      },
    },
    (req, reply) => {
      reply.status(200).send({})
    },
  )
}
