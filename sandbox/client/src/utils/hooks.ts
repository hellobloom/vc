import {useEffect} from 'react'

import {socketOn, socketOff, resetSocketConnection} from './socket'

export const useDocumentTitle = (title: string) => {
  useEffect(() => {
    const prevTitle = document.title
    document.title = title

    return () => {
      document.title = prevTitle
    }
  }, [title])
}

export const useSocket = (type: string, callback: (data: any) => void, condition?: boolean) => {
  useEffect(() => {
    if (condition === false) return

    socketOn(type, callback)

    return () => {
      socketOff(type, callback)
    }
  }, [type, callback, condition])
}

export const useResetSocketConnection = () => {
  useEffect(() => {
    resetSocketConnection()
  }, [])
}
