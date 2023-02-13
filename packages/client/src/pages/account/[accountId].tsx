import { useRouter } from 'next/router'
import React, { ReactNode, useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'

import { Box, Stack, Typography } from '@mui/material'

import styled from '@emotion/styled'

import PaidIcon from '@mui/icons-material/Paid'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import SavingsIcon from '@mui/icons-material/Savings'
import ReceiptIcon from '@mui/icons-material/Receipt'

import PieChart from '@/components/PieChart/PieChart'
import { getTransactionsByAccountId } from '@/api/transactions'
import TransactionsTable from '@/components/Table'
import LineChart from '@/components/LineChart/LineChart'
import useTransactions from '@/hooks/useTransactions'

import MainLayout from '@/components/main/MainLayout'
import { DigitCard } from '@/components/Transactions/DigitCard'

const Page = styled.div`
  display: block;
  margin: 0 auto;
  padding: 0 1rem;
  max-width: 1200px;
`

const AccountDetail = () => {
  const router = useRouter()
  const { accountId: _accId } = router.query

  const accountId = useMemo(() => _accId, [_accId]) as string

  const { data, isLoading } = useQuery({
    queryKey: ['transactionsByAccountId', accountId],
    queryFn: () => getTransactionsByAccountId(accountId),
    cacheTime: 1000 * 60 * 60,
    enabled: !!accountId,
  })

  const transactions = data?.data || []

  const { income, spending, saving, dataByCategories, dataBydate } =
    useTransactions({ transactions })

  console.log('dataBydate: ', dataBydate)

  return (
    <Page>
      <Typography variant={'h3'}>Account Overview</Typography>
      <Typography variant={'h5'}>YY Bank - Cheque Account</Typography>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        spacing={{ xs: 1, sm: 2, md: 4 }}>
        <DigitCard icon={<PaidIcon />} title={'Income'} text={income} />
        <DigitCard
          icon={<CreditCardIcon />}
          title={'Spending'}
          text={spending}
        />
        <DigitCard icon={<SavingsIcon />} title={'Saving'} text={saving} />
        <DigitCard
          icon={<ReceiptIcon />}
          title={'Upcoming Payment'}
          text={'1200.00'}
        />
      </Stack>

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

      <div>
        {isLoading ? (
          'Loading...'
        ) : (
          <Box borderRadius={2} sx={{ backgroundColor: 'transparent' }}>
            <TransactionsTable transactions={transactions} />
          </Box>
        )}
      </div>
    </Page>
  )
}

AccountDetail.getLayout = (page: ReactNode) => <MainLayout>{page}</MainLayout>

export default AccountDetail
