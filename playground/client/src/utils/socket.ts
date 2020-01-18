type Callback = (data: any) => void

type SocketHandlers = {
  [type: string]: Callback[]
}

const host = (() => {
  const isLocal = window.location.hostname === 'localhost'
  const protocol = isLocal ? 'ws' : 'wss'
  const port = isLocal ? '8081' : '443'

  return `${protocol}://${window.location.hostname}:${port}/websocket`
})()

let socket: WebSocket

const socketHandlers: SocketHandlers = {}

const resetSocketConnection = () => {
  socket = new WebSocket(host)

  socket.onmessage = (e: MessageEvent) => {
    try {
      const decoded = JSON.parse(e.data)
      if (decoded instanceof Array) {
        const callbacks = socketHandlers[decoded[0]]
        if (callbacks) callbacks.forEach(callback => callback(decoded[1]))
      }
    } catch (e) {
      console.log('Error in websocket callback', e)
    }
  }

  socket.onclose = (e: CloseEvent) => {
    return
  }
}

resetSocketConnection()

setInterval(() => {
  console.log('Socket state:', socket && socket.readyState)
}, 30000)

setInterval(() => {
  if (!socket || socket.readyState !== 1) {
    if (socket) {
      socket.close()
    }
    resetSocketConnection()
  }
}, 3000)

const socketOn = (type: string, callback: Callback) => {
  if (typeof socketHandlers[type] === 'undefined') {
    socketHandlers[type] = []
  }

  socketHandlers[type].push(callback)
}

const socketOff = (type: string, callback?: Callback) => {
  if (typeof socketHandlers[type] === 'undefined') return
  if (socketHandlers[type].length <= 0) return

  if (!callback) {
    socketHandlers[type].length = 0
  } else {
    const index = socketHandlers[type].indexOf(callback)

    if (index >= 0) {
      socketHandlers[type].splice(index, 1)
    }
  }
}

export {socketOn, socketOff, resetSocketConnection}
