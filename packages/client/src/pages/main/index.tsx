import React, { ReactNode } from 'react'

import { Grid, Paper } from '@mui/material'

import dynamic from 'next/dynamic'

import Copyright from '@/components/Copyright'

import MainLayout from '@/components/main/MainLayout'

import Deposits from '@/components/main/Deposits'
import Orders from '@/components/main/Orders'

function Main() {
  const DynamicChart = dynamic(() => import('@/components/main/Chart'))

  return (
    <div>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}>
            <DynamicChart />
          </Paper>
        </Grid>
        {/* Recent Deposits */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}>
            <Deposits />
          </Paper>
        </Grid>
        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Orders />
          </Paper>
        </Grid>
      </Grid>
      <Copyright sx={{ pt: 4 }} />
      {/* 
      <Button variant="contained" color="error">
        Logout
      </Button> */}
    </div>
  )
}

Main.getLayout = (page: ReactNode) => <MainLayout>{page}</MainLayout>

export default Main
