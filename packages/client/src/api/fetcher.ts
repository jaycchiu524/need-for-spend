import axios from 'axios'

import { useAuthStore } from '@/store/auth'

import { refreshToken } from '../auth/refreshToken'

export const fetcher = async () => {
  const { auth, logout } = useAuthStore.getState()

  if (!auth) return

  try {
    await refreshToken()

    const accessToken = auth.accessToken

    const headers = axios.defaults.headers.common

    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        ...headers,
        Authorization: `Bearer ${accessToken}`,
      },
    })
  } catch (err) {
    logout()
  }
}
