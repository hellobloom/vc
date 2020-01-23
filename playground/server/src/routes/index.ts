import fastify from 'fastify'

import {applyCredRoutes} from './cred'
import {applyShareRoutes} from './share'

export const applyApiRoutes = (app: fastify.FastifyInstance) => {
  applyCredRoutes(app)
  applyShareRoutes(app)
}
