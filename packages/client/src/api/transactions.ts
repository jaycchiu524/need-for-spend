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

export type MonthlySumOverTime = {
  year: number
  month: number
  expense: number
  income: number
  count: string
}

export type DailySumOverTime = {
  day: number
} & MonthlySumOverTime

type SumConfigs = {
  startDate?: string
  endDate?: string
  take?: number
  skip?: number
}

export type GetdailyExpenseResponse = DailySumOverTime[]
export type GetMonthlyExpenseResponse = MonthlySumOverTime[]

export const getMonthlyByAccoundId = async (
  accountId: string,
  configs?: SumConfigs,
) => {
  try {
    const api = await fetcher()
    if (!api) return
    const response = await api.get<GetMonthlyExpenseResponse>(
      `/accounts/${accountId}/expense/monthly`,
      {
        params: configs,
      },
    )
    return response
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>
    throw error
  }
}

export const getDailyByAccoundId = async (
  accountId: string,
  configs?: SumConfigs,
) => {
  try {
    const api = await fetcher()
    if (!api) return
    const response = await api.get<GetdailyExpenseResponse>(
      `/accounts/${accountId}/expense/daily`,
      {
        params: configs,
      },
    )
    return response
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>
    throw error
  }
}
