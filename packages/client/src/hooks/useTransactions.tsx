import { useQuery } from '@tanstack/react-query'

import { useMemo } from 'react'

import { Transaction } from '@/api/types'
import {
  MonthlySumOverTime,
  getTransactionsByAccountId,
  getMonthlyByAccoundId,
  getDailyByAccoundId,
  DailySumOverTime,
} from '@/api/transactions'
import { LineDatum } from '@/components/LineChart/types'

// Fake data
import { fakeTransactions } from '@/api/fakeData/fake-transactions'
import { fakeDaily } from '@/api/fakeData/fake-daily'
import { fakeMonthly } from '@/api/fakeData/fake-monthly'

type Props = {
  accountId: string
}

function categorize(transactions: Transaction[]) {
  const categories = transactions.reduce((acc, transaction) => {
    if (!transaction.category) return acc
    if (transaction.amount < 0) return acc

    if (acc[transaction.category.name]) {
      acc[transaction.category.name] += transaction.amount
    } else {
      acc[transaction.category.name] = transaction.amount
    }

    return acc
  }, {} as Record<string, number>)

  return Object.entries(categories).reduce((acc, [key, value]) => {
    if (value <= 0) return acc
    acc.push({ name: key, value })
    return acc
  }, [] as { name: string; value: number }[])
}

function convertChartData(data: (MonthlySumOverTime | DailySumOverTime)[]) {
  return data.reduce((acc, exp) => {
    const { year, month, income, expense, count } = exp
    // declare day to avoid type error
    let day: number | undefined
    if ('day' in exp) {
      day = exp.day
    }
    acc.push({
      date: new Date(`${year}-${month}${day ? `-${day}` : ''}`),
      expense,
      income,
      count,
    })
    return acc
  }, [] as LineDatum[])
}

const useTransactions = ({ accountId }: Props) => {
  const DEBUG = !!process.env.NEXT_PUBLIC_DEBUG
  const { data, isLoading } = useQuery({
    queryKey: ['transactionsByAccountId', accountId],
    queryFn: () => getTransactionsByAccountId(accountId),
    cacheTime: 1000 * 60 * 60,
    enabled: !!accountId && !DEBUG,
  })

  const { data: _monthlyExpense } = useQuery({
    queryKey: ['monthlyExpense', accountId],
    queryFn: () => getMonthlyByAccoundId(accountId),
    enabled: !!accountId && !DEBUG,
  })
  const { data: _dailyExpense } = useQuery({
    queryKey: ['dailyExpense', accountId],
    queryFn: () => getDailyByAccoundId(accountId),
    enabled: !!accountId && !DEBUG,
  })

  const transactions = useMemo(
    () => (DEBUG ? fakeTransactions : data?.data || []),
    [DEBUG, data?.data],
  )
  const monthlyExpense = useMemo(
    () => (DEBUG ? fakeMonthly : _monthlyExpense?.data || []),
    [DEBUG, _monthlyExpense?.data],
  )
  const dailyExpense = useMemo(
    () => (DEBUG ? fakeDaily : _dailyExpense?.data || []),
    [DEBUG, _dailyExpense?.data],
  )

  const dataByCategories = useMemo(
    () => categorize(transactions),
    [transactions],
  )
  const monthlyData = useMemo(
    () => convertChartData(monthlyExpense),
    [monthlyExpense],
  )
  const dailyData = useMemo(
    () => convertChartData(dailyExpense),
    [dailyExpense],
  )

  return {
    dataByCategories,
    monthlyData,
    dailyData,
    transactions,
  }
}

export default useTransactions
