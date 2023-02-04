import { AxiosError } from 'axios'

import { PlaidLinkOnSuccessMetadata } from 'react-plaid-link'

import { ErrorResponse, Item } from '@/api/types'

import { fetcher } from '@/api/fetcher'

export type CreateLinkTokenResponse = {
  link_token: string
}

export type ExchangeAccessTokenRequest = {
  publicToken: string
  accounts: PlaidLinkOnSuccessMetadata['accounts']
  institutionId: string
  institutionName: string
}

export type ExchangeAccessTokenResponse = Item

export const createLinkToken = async (data: {
  userId: string | null
  itemId: string | null
}) => {
  try {
    const api = await fetcher()
    if (!api) return
    const response = await api.post<CreateLinkTokenResponse>(
      '/link-token',
      data,
    )
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
