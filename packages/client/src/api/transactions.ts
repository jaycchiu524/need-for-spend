import { AxiosError } from 'axios'

import { format, add } from 'date-fns'

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

export interface MonthlySumOverTime {
  year: number
  month: number
  expense: number
  income: number
  count: string
}

export interface DailySumOverTime extends MonthlySumOverTime {
  day: number
}

type SumConfigs = {
  startDate?: string
  endDate?: string
  take?: number
  skip?: number
}

export const getMonthlyByAccoundId = async (
  accountId: string,
  configs?: SumConfigs,
) => {
  try {
    const api = await fetcher()
    if (!api) return
    const response = await api.get<MonthlySumOverTime[]>(
      `/accounts/${accountId}/expense/monthly`,
      {
        params: {
          startDate: format(add(new Date(), { years: -1 }), 'yyyy-MM-dd'),
          endDate: format(new Date(), 'yyyy-MM-dd'),
          ...configs,
        },
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
    const response = await api.get<DailySumOverTime[]>(
      `/accounts/${accountId}/expense/daily`,
      {
        params: {
          startDate: format(add(new Date(), { months: -1 }), 'yyyy-MM-dd'),
          endDate: format(new Date(), 'yyyy-MM-dd'),
          ...configs,
        },
      },
    )
    return response
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>
    throw error
  }
}
