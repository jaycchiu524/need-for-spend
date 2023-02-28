import { useRouter } from 'next/router'
import React, { ReactNode, useMemo, useState } from 'react'

import { Box, Grid, Stack, Tab, Tabs, Typography } from '@mui/material'

import styled from '@emotion/styled'

import PaidIcon from '@mui/icons-material/Paid'
import SavingsIcon from '@mui/icons-material/Savings'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'

import { useQuery } from '@tanstack/react-query'

import LineChart from '@/components/LineChart/LineChart'
import useTransactions from '@/hooks/useTransactions'

import MainLayout from '@/components/main/MainLayout'
import { DigitCard } from '@/components/Transactions/DigitCard'
import TransactionsTable from '@/components/Table'
import PieChart from '@/components/PieChart/PieChart'
import { useAccountStore } from '@/store/accounts'
import { Timespan } from '@/components/LineChart/types'
import { getAccountById } from '@/api/accounts'

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
  const [timespan, setTimespan] = useState<Timespan>(Timespan.Daily)

  const router = useRouter()
  const { accountId: _accId } = router.query

  const accountId = useMemo(() => _accId, [_accId]) as string

  const { byId, setIdAccounts } = useAccountStore()

  const { data } = useQuery({
    queryKey: ['account', accountId],
    queryFn: () => getAccountById(accountId),
    enabled: !byId[accountId] && !!accountId,
    onSuccess(data) {
      if (!data?.data) return
      setIdAccounts(accountId, data?.data)
    },
  })

  const curAccount = byId[accountId] || data?.data

  const { transactions, dataByCategories, monthlyData, dailyData } =
    useTransactions({ accountId })

  return (
    <Page>
      <Typography variant={'h4'} fontWeight={800}>
        {curAccount.name}
      </Typography>

      <Grid
        sx={{ flexGrow: 1 }}
        container
        spacing={{ xs: 1, sm: 2, md: 2 }}
        mb={2}
        justifyContent="center">
        {/* <GridItem>
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
        </GridItem> */}
        {curAccount.type && (
          <GridItem>
            <DigitCard
              icon={<AccountBalanceIcon />}
              title={'type'}
              text={curAccount.type}
            />
          </GridItem>
        )}
        {curAccount.balanceIsoCurrencyCode && (
          <GridItem>
            <DigitCard
              icon={<PaidIcon />}
              title={'Currency'}
              text={curAccount.balanceIsoCurrencyCode}
            />
          </GridItem>
        )}
        {curAccount.balanceAvailable && (
          <GridItem>
            <DigitCard
              icon={<AccountBalanceWalletIcon />}
              title={'Balance'}
              text={curAccount.balanceAvailable.toFixed(2)}
            />
          </GridItem>
        )}

        {curAccount.mask && (
          <GridItem>
            <DigitCard
              icon={<SavingsIcon />}
              title={'Last 4 digits'}
              text={curAccount.mask}
            />
          </GridItem>
        )}
      </Grid>

      <Tabs
        sx={{ display: 'flex', flex: 1, width: '100%', height: '24px' }}
        value={timespan}
        onChange={(e, v) => setTimespan(v)}
        aria-label="basic tabs example">
        <Tab label="Weekly" value={Timespan.Daily} />
        <Tab label="Monthly" value={Timespan.Monthly} />
      </Tabs>

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
          {!!monthlyData && !!dailyData ? (
            <LineChart
              data={timespan === Timespan.Daily ? dailyData : monthlyData}
              timespan={timespan}
            />
          ) : (
            <p>Loading...</p>
          )}
        </Box>
      </Stack>

      <div>
        <Box borderRadius={2} sx={{ backgroundColor: 'transparent' }}>
          <TransactionsTable transactions={transactions} />
        </Box>
      </div>
    </Page>
  )
}

AccountDetail.getLayout = (page: ReactNode) => <MainLayout>{page}</MainLayout>

export default AccountDetail
