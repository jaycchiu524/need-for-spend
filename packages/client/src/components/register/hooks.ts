import { AxiosError } from 'axios'

import { api } from '@/api/api'

import { ErrorResponse } from '@/api/types'

import { RegisterRequest, RegisterResponse } from './types'

export const registerRequest = async (data: RegisterRequest) => {
  try {
    const resp = await api.post<RegisterResponse>('/auth/register', data)
    return resp
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>
    throw error
  }
}
