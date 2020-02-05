import {getExchange, getQueue, getChannel} from '@server/amqp'

export type TNotifMsgObj = {
  recipient: string
  type: string
  payload: string
}

export const sendNotification = async (messageObj: TNotifMsgObj) => {
  const channel = await getChannel()
  const queue = getQueue()
  const exchange = getExchange()

  await channel.publish(exchange, queue, messageObj)
}
