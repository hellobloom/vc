import fastify from 'fastify'
import helmet from 'fastify-helmet'
import cookie from 'fastify-cookie'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import {getEnv} from '@server/env'
import {applyRoutes} from '@server/routes'
import {applySocketWorker} from '@server/socket/worker'
import {initModels} from '@server/models'

const main = async () => {
  dayjs.extend(utc)

  initModels()

  const env = getEnv()
  const app = fastify({logger: true, bodyLimit: 10000000})

  app.register(helmet)
  app.register(cookie, {secret: env.sessionSecret})

  if (env.host) {
    app.listen(env.port, env.host)
  } else {
    app.listen(env.port)
  }

  applyRoutes(app)
  applySocketWorker(app)

  app.all('*', (_, reply) => {
    console.log('Unhandled request')
    reply.status(404).send({success: false, error: 'Not found'})
  })
}

main()
  .then(() => {
    console.log('sandbox successfully started')
  })
  .catch((e: any) => {
    console.log('sandbox failed to start', e)
  })
