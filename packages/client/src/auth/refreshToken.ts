import { AxiosError } from 'axios'

import { api } from '@/api/api'
import { LoginSuccessResponse } from '@/components/login/types'
import { useAuthStore } from '@/store/auth'
import { ErrorResponse } from '@/api/types'

export const refreshToken = async () => {
  const auth = useAuthStore.getState().auth
  if (!auth || !auth.refreshToken) return

  // Check exp date
  const expDate = auth.exp * 1000
  const now = Date.now()
  if (expDate > now) return null

  try {
    const { data } = await api.post<LoginSuccessResponse>(
      '/auth/refresh-token',
      {
        refreshToken: auth.refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      },
    )

    useAuthStore.getState().setToken(data)

    return data
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>
    throw error
  }
}
