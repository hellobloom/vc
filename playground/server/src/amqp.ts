import {uuid} from 'uuidv4'
import amqpMgr from 'amqp-connection-manager'
import amqp, {ConfirmChannel} from 'amqplib'

import {getEnv} from '@server/env'

export const getExchange = () => {
  const e = getEnv()
  return e.amqp.exchange || 'amq.fanout'
}

export const getQueue = () => {
  const e = getEnv()
  return e.amqp.queue + '-' + uuid()
}

export const establishExchange = async () => {
  const e = getEnv()
  const conn = await amqp.connect(e.amqp.host)
  const tempChan = await conn.createChannel()
  try {
    await tempChan.assertExchange(getExchange(), 'fanout')
    console.log('AMQP: Exchange created...')
    await tempChan.close()
  } catch (err) {
    console.log('AMQP: Exchange exists, continuing...', err)
  }
}

export const getChannel = async (callbackFn?: any) => {
  console.log('AMQP: Initializing...')
  const q = getQueue()
  const exchange = getExchange()

  await establishExchange()

  const e = getEnv()
  const conn = amqpMgr.connect([e.amqp.host])
  conn.on('connect', () => {
    console.log('AMQP: connected')
  })
  conn.on('disconnect', ({err}) => {
    console.log('AMQP: disconnected', err)
  })
  const chanW = conn.createChannel({
    json: true,
    setup: async (channel: ConfirmChannel) => {
      console.log('AMQP: binding', exchange, q)
      await channel.assertQueue(q)
      await (channel.bindQueue as any)(q, exchange)
      if (callbackFn) {
        await channel.consume(q, msg => {
          if (msg !== null) callbackFn(msg, channel)
        })
      }
    },
  })

  return chanW
}
