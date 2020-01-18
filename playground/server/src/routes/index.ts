import fastify from 'fastify'

import {applyShareRoutes} from './share'

export const applyApiRoutes = (app: fastify.FastifyInstance) => {
  applyShareRoutes(app)
}
