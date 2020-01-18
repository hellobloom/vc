import fastify from 'fastify'
import helmet from 'fastify-helmet'

import {getEnv} from '@server/env'
import {applyApiRoutes} from '@server/routes'

const main = async () => {
  const env = getEnv()
  const app = fastify()

  app.register(helmet)

  if (env.host) {
    app.listen(env.port, env.host)
  } else {
    app.listen(env.port)
  }

  applyApiRoutes(app)

  app.all('*', (_, reply) => {
    console.log('Unhandled request')
    reply.status(404).send({success: false, error: 'Not found'})
  })
}

main()
  .then(() => {
    console.log('playground successfully started')
  })
  .catch((e: any) => {
    console.log('playground failed to start', e)
  })
