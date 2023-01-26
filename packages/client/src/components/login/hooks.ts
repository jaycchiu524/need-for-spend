import { AxiosError } from 'axios'

import { api } from '@/api/api'

import { ErrorResponse } from '@/api/types'

import { LoginRequest, LoginSuccessResponse } from './types'

export const loginRequest = async (data: LoginRequest) => {
  try {
    const resp = await api.post<LoginSuccessResponse>('/auth/login', data)
    return resp
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>
    throw error
  }
}
