import { useMemo } from 'react'

import { Transaction } from '@/api/types'
import {
  GetdailyExpenseResponse,
  GetMonthlyExpenseResponse,
  MonthlySumOverTime,
} from '@/api/transactions'

type Props = {
  transactions: Transaction[]
  monthlyExpense: GetMonthlyExpenseResponse
  dailyExpense: GetdailyExpenseResponse
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

const useTransactions = ({
  transactions,
  monthlyExpense,
  dailyExpense,
}: Props) => {
  const [spending, income, saving] = useMemo(
    () => calcaulate(transactions),
    [transactions],
  )

  const dataByCategories = useMemo(
    () => categorize(transactions),
    [transactions],
  )

  // const dataBydate = useMemo(
  //   () =>
  //     transactions
  //       .reduce((acc, t) => {
  //         if (t.amount < 0) return acc
  //         acc.push({ date: new Date(t.date), value: t.amount })
  //         return acc
  //       }, [] as { date: Date; value: number }[])
  //       .sort((a, b) => a.date.getTime() - b.date.getTime()),
  //   [transactions],
  // )
  const monthlyData = useMemo(
    () => convertChartData(monthlyExpense),
    [monthlyExpense],
  )

  const dailyData = useMemo(
    () => convertChartData(dailyExpense),
    [dailyExpense],
  )

  return {
    spending,
    income,
    saving,
    dataByCategories,
    monthlyData,
    dailyData,
  }
}

export default useTransactions
