import React, { useRef } from 'react'
import { io, type Socket } from 'socket.io-client'

interface ServerToClientEvents {
  noArg: () => void
  basicEmit: (a: number, b: string, c: Buffer) => void
  withAck: (d: string, callback: (e: number) => void) => void
}

interface ClientToServerEvents {
  hello: () => void
}

const Sockets = () => {
  const socket = useRef<Socket<ServerToClientEvents, ClientToServerEvents>>()

  React.useEffect(() => {
    console.log(process.env.NEXT_PUBLIC_API_URL)
    if (!process.env.NEXT_PUBLIC_API_URL) return

    socket.current = io(process.env.NEXT_PUBLIC_API_URL, {
      transports: ['websocket'],
      query: {
        userId: '123',
      },
    })

    return () => {
      socket.current?.removeAllListeners()
      socket.current?.close()
    }
  }, [])
}

export default Sockets
