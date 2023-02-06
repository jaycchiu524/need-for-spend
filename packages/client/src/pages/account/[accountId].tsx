import { useRouter } from 'next/router'
import React, { useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'

import { Box } from '@mui/material'

import PieChart from '@/components/PieChart/PieChart'
import { getTransactionsByAccountId } from '@/api/transactions'
import TransactionsTable from '@/components/Table'
import { Transaction } from '@/api/types'

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
    if (transaction.categoryId) {
      if (acc[transaction.categoryId]) {
        acc[transaction.categoryId] += transaction.amount
      } else {
        acc[transaction.categoryId] = transaction.amount
      }
    }

    return acc
  }, {} as Record<string, number>)

  return Object.entries(categories).reduce((acc, [key, value]) => {
    if (value <= 0) return acc
    acc.push({ name: key, value })
    return acc
  }, [] as { name: string; value: number }[])
}

const AccountDetail = () => {
  const router = useRouter()
  const { accountId: _accId } = router.query

  const accountId = useMemo(() => _accId, [_accId]) as string

  const { data, isLoading } = useQuery({
    queryKey: ['transactionsByAccountId', accountId],
    queryFn: () => getTransactionsByAccountId(accountId),
    cacheTime: 60 * 1000,
  })

  const transactions = useMemo(() => data?.data || [], [data?.data])

  const [spending, income, saving] = useMemo(
    () => calcaulate(transactions),
    [transactions],
  )

  const categories = useMemo(() => categorize(transactions), [transactions])

  return (
    <>
      <h2>AccountDetail</h2>

      <p>Net Income: {income}</p>
      <p>Net Spending: {spending}</p>
      <p>Net Saving: {saving}</p>

      <div>
        {isLoading ? (
          'Loading...'
        ) : (
          <TransactionsTable transactions={transactions} />
        )}
      </div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <h2>Categorized Spending</h2>

        {!!categories ? (
          <PieChart width={500} height={500} data={categories} />
        ) : (
          <p>Loading...</p>
        )}
      </Box>
    </>
  )
}

export default AccountDetail
