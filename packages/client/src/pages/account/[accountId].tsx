import { useRouter } from 'next/router'
import React, { ReactNode, useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'

import { Box, Grid, Stack, Typography } from '@mui/material'

import styled from '@emotion/styled'

import PaidIcon from '@mui/icons-material/Paid'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import SavingsIcon from '@mui/icons-material/Savings'
import ReceiptIcon from '@mui/icons-material/Receipt'

import { getTransactionsByAccountId } from '@/api/transactions'
import LineChart from '@/components/LineChart/LineChart'
import useTransactions from '@/hooks/useTransactions'

import MainLayout from '@/components/main/MainLayout'
import { DigitCard } from '@/components/Transactions/DigitCard'
import TransactionsTable from '@/components/Table'
import PieChart from '@/components/PieChart/PieChart'
import { useAccountStore } from '@/store/accounts'

const Page = styled.div`
  display: block;
  margin: 0 auto;
  padding: 0 1rem;
  max-width: 1200px;
`

const GridItem = ({ children }: { children: ReactNode }) => {
  return (
    <Grid
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      item
      xs={6}
      md={3}>
      {children}
    </Grid>
  )
}

const AccountDetail = () => {
  const router = useRouter()
  const { accountId: _accId } = router.query

  const accountId = useMemo(() => _accId, [_accId]) as string

  const { byId } = useAccountStore()

  const curAccount = byId[accountId]

  const { data, isLoading } = useQuery({
    queryKey: ['transactionsByAccountId', accountId],
    queryFn: () => getTransactionsByAccountId(accountId),
    cacheTime: 1000 * 60 * 60,
    enabled: !!accountId,
  })

  const transactions = data?.data || []

  const { income, spending, saving, dataByCategories, dataBydate } =
    useTransactions({ transactions })

  return (
    <Page>
      <Typography variant={'h4'} fontWeight={800}>
        {curAccount?.name || ''}
      </Typography>

      <Grid
        sx={{ flexGrow: 1 }}
        container
        spacing={{ xs: 1, sm: 2, md: 2 }}
        mb={2}
        justifyContent="center">
        <GridItem>
          <DigitCard icon={<PaidIcon />} title={'Income'} text={income} />
        </GridItem>
        <GridItem>
          <DigitCard
            icon={<CreditCardIcon />}
            title={'Spending'}
            text={spending}
          />
        </GridItem>
        <GridItem>
          <DigitCard icon={<SavingsIcon />} title={'Saving'} text={saving} />
        </GridItem>
        <GridItem>
          <DigitCard icon={<ReceiptIcon />} title={'Bills'} text={'1200.00'} />
        </GridItem>
      </Grid>

      <Stack
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
        }}
        direction={{ xs: 'column', sm: 'row' }}>
        <Box
          width={{ xs: '100%', sm: '50%' }}
          sx={{
            display: 'block',
            height: '100%',
          }}>
          {!!dataByCategories ? (
            <PieChart data={dataByCategories} />
          ) : (
            <p>Loading...</p>
          )}
        </Box>

        <Box
          width={{ xs: '100%', sm: '100%' }}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            aspectRatio: '16/9',
          }}>
          {!!dataBydate ? (
            <LineChart
              //  width={chartW} height={chartH}
              data={dataBydate}
            />
          ) : (
            <p>Loading...</p>
          )}
        </Box>
      </Stack>

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
