import { AxiosError } from 'axios'

import { ErrorResponse } from '@/api/types'

import { fetcher } from '@/api/fetcher'

import {
  CreateLinkTokenResponse,
  ExchangeAccessTokenRequest,
  ExchangeAccessTokenResponse,
} from './types'

export const createLinkToken = async () => {
  try {
    const api = await fetcher()
    if (!api) return
    const response = await api.post<CreateLinkTokenResponse>('/link-token')
    return response
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>
    throw error
  }
}

export const exchangeAccessToken = async (data: ExchangeAccessTokenRequest) => {
  try {
    const api = await fetcher()
    if (!api) return
    const response = await api.post<ExchangeAccessTokenResponse>('/items', data)
    return response
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>
    throw error
  }
}
