import { AxiosError } from 'axios'

import { ErrorResponse, Account } from '@/api/types'

import { fetcher } from '@/api/fetcher'

export type AccountType = Account
type GetAccountsByItemIdResponse = AccountType[]
type GetAccountsByUserIdResponse = AccountType[]

export const getAccountByItemId = async (itemId: string) => {
  try {
    const api = await fetcher()
    if (!api) return
    const response = await api.get<GetAccountsByItemIdResponse>(
      `/items/${itemId}/accounts`,
    )
    return response
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>
    throw error
  }
}
export const getAccountsByUserId = async (userId: string) => {
  try {
    const api = await fetcher()
    if (!api) return
    const response = await api.get<GetAccountsByUserIdResponse>(
      `/users/${userId}/accounts`,
    )
    return response
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>
    throw error
  }
}

export const getAccountById = async (id: string) => {
  try {
    const api = await fetcher()
    if (!api) return
    const response = await api.get<AccountType>(`/accounts/${id}`)
    return response
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>
    throw error
  }
}
