import WebSocket, {OPEN, CLOSED, Server} from 'ws'
import cookie from 'cookie'
import cookieSignature from 'cookie-signature'
import {isUuid} from 'uuidv4'
import {ConsumeMessage} from 'amqplib'

import {getEnv} from '@server/env'
import {shareCookieKey, claimCookieKey} from '@server/cookies'
import {getChannel} from '@server/amqp'
import fastify from 'fastify'

type Socket = WebSocket & {
  last_pong: number
  tokens: string[]
}

const socketMapping: {[token: string]: Socket[] | undefined} = {}

const pingMessage = JSON.stringify(['redundant-ping', {}])

const addSocket = (socket: Socket, tokens: string[]) => {
  socket.tokens = tokens

  console.log('Registering socket with tokens', JSON.stringify(tokens))

  tokens.forEach(token => {
    if (socketMapping[token] === undefined) {
      socketMapping[token] = []
    }

    socketMapping[token]!.push(socket)
  })
}

const removeSocket = (socket: Socket, tokens: string[]) => {
  console.log('Removing socket with tokens', socket.tokens)

  try {
    socket.close()
  } catch (err) {
    console.log("Couldn't close socket", err)
  }

  tokens.forEach((token: string) => {
    const arr = socketMapping[token]

    if (!arr) {
      return
    } else if (arr.length === 1 && arr[0] === socket) {
      delete socketMapping[token]
    } else {
      socketMapping[token] = arr.filter(x => x !== socket)
    }
  })
}

export const handleMessage = (msg: ConsumeMessage, channel: any) => {
  try {
    if (!msg) return

    channel.ack(msg)

    const decoded = JSON.parse(msg.content.toString())
    const uSockets = socketMapping[decoded.recipient]

    if (!uSockets || uSockets.length === 0) {
      return
    }

    uSockets.forEach(socket => {
      if (socket.readyState === OPEN) {
        socket.send(JSON.stringify([decoded.type, decoded.payload]))
      } else {
        console.log('AMQP Socket had non-acceptable readyState', socket.readyState)
      }
    })
  } catch (err) {
    console.log('AMQP Error handling socket message', msg, err)
  }
}

export const applySocketWorker = ({server}: fastify.FastifyInstance) => {
  const wss = new Server({server})
  getChannel(handleMessage)

  wss.on('connection', async (socket: Socket, request) => {
    if (!request.headers.cookie) {
      console.log('SOCKETWORKER: Terminating socket with no cookie')
      socket.terminate()
      return
    }

    const sessionSecret = getEnv().sessionSecret
    const cookieObj = cookie.parse(request.headers.cookie)
    const tokens: string[] = []

    const cookiesToCheckFor = [
      {
        key: shareCookieKey,
        validator: isUuid,
      },
      {
        key: claimCookieKey,
        validator: isUuid,
      },
    ]

    cookiesToCheckFor.forEach(({key, validator}) => {
      const signedCookie = cookieObj[key]

      if (signedCookie) {
        const value = cookieSignature.unsign(signedCookie, sessionSecret)

        if (value && validator(value)) {
          tokens.push(value)
        } else {
          socket.terminate()
        }
      }
    })

    // Don't terminate here, the client will just keep trying to connect
    if (tokens.length === 0) return

    addSocket(socket, tokens)

    socket.on('pong', () => {
      socket.last_pong = new Date().getTime()
    })
  })

  wss.on('error', error => {
    console.log(`[WebSocket] An error occured within WebSockets`, error)
  })

  setInterval(() => {
    console.log(
      'Socket health check',
      Object.keys(socketMapping).reduce((acc: any, key: string) => {
        const ref = socketMapping[key]
        if (ref) {
          acc[key] = ref.length
        }
        return acc
      }, {}),
    )
  }, 10000)

  setInterval(() => {
    Object.keys(socketMapping).forEach((token: string) => {
      const arr = socketMapping[token]
      if (!arr) {
        return
      }
      arr.forEach(socket => {
        const now = new Date().getTime()

        if (now - socket.last_pong > 18000 || socket.readyState === CLOSED) {
          return removeSocket(socket, socket.tokens)
        }

        socket.ping(() => undefined)

        if (socket.readyState === OPEN) socket.send(pingMessage)
      })
    })
  }, 6000)
}
