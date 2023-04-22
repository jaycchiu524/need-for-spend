import React, { useRef } from 'react'
import { io, type Socket } from 'socket.io-client'

import { toast } from 'react-toastify'

import { useAuthStore } from '@/store/auth'

import 'react-toastify/dist/ReactToastify.css'

interface ServerToClientEvents {
  SYNC_UPDATES_AVAILABLE: (plaidItemId: string) => void
}

interface ClientToServerEvents {
  hello: () => void
}

const useSocket = () => {
  // Socket < ListenEvents, EmitEvents >
  const socket = useRef<Socket<ServerToClientEvents, ClientToServerEvents>>()
  const userId = useAuthStore.getState().auth?.id

  React.useEffect(() => {
    if (!process.env.NEXT_PUBLIC_API_URL || !userId) return

    socket.current = io(process.env.NEXT_PUBLIC_API_URL, {
      transports: ['websocket'],
      query: {
        userId: userId,
      },
    })

    socket.current.on('connect', () => {
      toast('Connected to socket server')
    })

    socket.current.on('SYNC_UPDATES_AVAILABLE', (plaidItemId) => {
      toast(`SYNC_UPDATES_AVAILABLE: ${plaidItemId}`)
    })

    return () => {
      socket.current?.removeAllListeners()
      socket.current?.close()
    }
  }, [userId])
}

export default useSocket
