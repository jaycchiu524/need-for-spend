import { useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'

import { Transaction } from '@/api/types'
import {
  MonthlySumOverTime,
  getTransactionsByAccountId,
  getMonthlyByAccoundId,
  getDailyByAccoundId,
} from '@/api/transactions'

type Props = {
  accountId: string
}

interface ChartData {
  date: Date
  expense: number
  income: number
  count: string
}

function calcaulate(transactions: Transaction[]) {
  const _spending = transactions.reduce((acc, transaction) => {
    if (transaction.amount > 0) {
      return acc + transaction.amount
    }

    return acc
  }, 0)

  const _income = transactions.reduce((acc, transaction) => {
    if (transaction.amount < 0) {
      return acc + transaction.amount
    }

    return acc
  }, 0)

  const spending = _spending.toFixed(2)
  const income = Math.abs(_income).toFixed(2)

  const saving = (Number(income) - Number(spending)).toFixed(2)

  return [spending, income, saving]
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

function convertChartData(data: (MonthlySumOverTime & { day?: number })[]) {
  return data.reduce((acc, exp) => {
    const { year, month, income, expense, count } = exp
    const day = exp.day
    acc.push({
      date: new Date(`${year}-${month}${day ? `-${day}` : ''}`),
      expense,
      income,
      count,
    })
    return acc
  }, [] as ChartData[])
}

const useTransactions = ({ accountId }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ['transactionsByAccountId', accountId],
    queryFn: () => getTransactionsByAccountId(accountId),
    cacheTime: 1000 * 60 * 60,
    enabled: !!accountId,
  })

  const { data: _monthlyExpense } = useQuery({
    queryKey: ['monthlyExpense', accountId],
    queryFn: () => getMonthlyByAccoundId(accountId),
    enabled: !!accountId,
  })
  const { data: _dailyExpense } = useQuery({
    queryKey: ['dailyExpense', accountId],
    queryFn: () => getDailyByAccoundId(accountId),
    enabled: !!accountId,
  })

  const transactions = useMemo(() => data?.data || [], [data])
  const monthlyExpense = useMemo(
    () => _monthlyExpense?.data || [],
    [_monthlyExpense],
  )
  const dailyExpense = useMemo(() => _dailyExpense?.data || [], [_dailyExpense])

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
