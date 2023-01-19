import { AxiosError } from 'axios'

import { api } from '@/api'

import { RegisterRequest, RegisterResponse } from './types'

export const registerRequest = async (data: RegisterRequest) => {
  try {
    const resp = await api.post<RegisterResponse>('/register', data)
    return resp
  } catch (err) {
    const error = err as AxiosError<RegisterResponse>
    throw error
  }
}
