import { useRouter } from 'next/router'
import React, { useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'

import { Box } from '@mui/material'

import PieChart from '@/components/PieChart/PieChart'
import { getTransactionsByAccountId } from '@/api/transactions'
import TransactionsTable from '@/components/Table'
import LineChart from '@/components/LineChart/LineChart'
import useTransactions from '@/hooks/useTransactions'

const AccountDetail = () => {
  const router = useRouter()
  const { accountId: _accId } = router.query

  const accountId = useMemo(() => _accId, [_accId]) as string

  const { data, isLoading } = useQuery({
    queryKey: ['transactionsByAccountId', accountId],
    queryFn: () => getTransactionsByAccountId(accountId),
  })

  const transactions = useMemo(() => data?.data || [], [data?.data])

  const { income, spending, saving, dataByCategories, dataBydate } =
    useTransactions({ transactions })

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

        {!!dataByCategories ? (
          <PieChart width={500} height={500} data={dataByCategories} />
        ) : (
          <p>Loading...</p>
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <h2>Spending Over Time</h2>

        {!!dataBydate ? (
          <LineChart width={640} height={400} data={dataBydate} />
        ) : (
          <p>Loading...</p>
        )}
      </Box>
    </>
  )
}

export default AccountDetail
