import { AxiosError } from 'axios'

import { api } from '@/api/api'
import { LoginSuccessResponse } from '@/components/login/types'
import { useAuthStore } from '@/store/store'
import { ErrorResponse } from '@/api/types'

export const refreshToken = async () => {
  const auth = useAuthStore.getState().auth
  if (!auth || !auth.refreshToken) return

  // Check exp date
  const expDate = auth.exp * 1000
  const now = Date.now()
  if (expDate > now) return

  try {
    const { data } = await api.post<LoginSuccessResponse>(
      '/auth/refresh-token',
      {
        refreshToken: auth.refreshToken,
      },
    )

    useAuthStore.getState().setToken(data)
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>
    throw error
  }
}
