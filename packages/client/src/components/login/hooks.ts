import { AxiosError } from 'axios'

import { api } from '@/api'

import { LoginFailResponse, LoginRequest, LoginSuccessResponse } from './types'

export const loginRequest = async (data: LoginRequest) => {
  try {
    const resp = await api.post<LoginSuccessResponse>('/auth/login', data)
    return resp
  } catch (err) {
    const error = err as AxiosError<LoginFailResponse>
    throw error
  }
}
