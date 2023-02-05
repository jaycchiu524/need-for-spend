import { AxiosError } from 'axios'

import { ErrorResponse, Transaction } from '@/api/types'

import { fetcher } from '@/api/fetcher'

export type TransactionType = Transaction
type GetTransactionsByAccountIdResponse = TransactionType[]

export const getTransactionsByAccountId = async (accountId: string) => {
  try {
    const api = await fetcher()
    if (!api) return
    const response = await api.get<GetTransactionsByAccountIdResponse>(
      `/accounts/${accountId}/transactions`,
    )
    return response
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>
    throw error
  }
}
