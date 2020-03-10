import fastify from 'fastify'

import {applyCredRoutes} from './cred'
import {applyShareRoutes} from './share'
import {applyWellKnownRoutes} from './well-known'

export const applyRoutes = (app: fastify.FastifyInstance) => {
  applyCredRoutes(app)
  applyShareRoutes(app)
  applyWellKnownRoutes(app)
}
