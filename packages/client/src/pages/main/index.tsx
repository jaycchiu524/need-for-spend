import React, { ReactNode, useEffect, useState } from 'react'

import Button from '@mui/material/Button'

import { Box, Typography } from '@mui/material'

import useLink from '@/hooks/useLink'

import useItems from '@/hooks/useItems'

import MainLayout from '@/components/main/MainLayout'
import { useItemStore } from '@/store/items'
import { useLinkTokenStore } from '@/store/link-token'
import { useAuthStore } from '@/store/auth'
import LaunchLink from '@/components/LaunchLink'
import ItemCard from '@/components/ItemCard/ItemCard'

function PlaidHome() {
  const DEBUG = !!process.env.NEXT_PUBLIC_DEBUG
  const userId = useAuthStore.getState().auth?.id
  const userItem = useItemStore().byUser
  const { users } = useLinkTokenStore.getState()
  const { generateLinkToken } = useLink()
  const { fetchItemsByUser } = useItems({ userId: userId!, itemId: null })

  const initialToken = async () => {
    if (DEBUG) return

    if (!userId) return null
    await generateLinkToken(userId, null)
  }

  useEffect(() => {
    if (DEBUG) return

    if (!userId) return
    fetchItemsByUser(userId)
  }, [DEBUG, userId, fetchItemsByUser])

  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const items = userItem[userId!] || []

  return (
    <Box>
      {userId && users[userId] && (
        <LaunchLink userId={userId} itemId={null} linkToken={users[userId]} />
      )}

      <Button
        variant="outlined"
        onClick={initialToken}
        disabled={!!(userId && users[userId])}>
        Connect new bank account
      </Button>

      {mounted && items.map((item) => <ItemCard key={item.id} item={item} />)}

      <Box sx={{ mt: 4 }}>
        <Typography component="h1" variant="h6">
          What is Need For Spend
        </Typography>
        <Typography variant="subtitle1" fontStyle="italic">
          The Safe and Secure Way to Track Your Spending with Plaid
        </Typography>
        <p>
          Need For Spend is an app that allows you to easily connect your bank
          accounts and track your spending all in one place. By integrating with
          <span>Plaid</span>, a trusted third-party API, Need For Spend is able
          to provide you with an accurate and up-to-date view of your finances.
        </p>

        <Typography component="h1" variant="h6">
          What is Plaid
        </Typography>

        <p>
          One of the main benefits of using Need For Spend is the security and
          safety that comes with using Plaid. Plaid is a leading financial
          technology company that is trusted by millions of people and
          institutions around the world. By using Plaid, Need For Spend is able
          to securely access your financial data without storing your login
          credentials or sensitive information. This means that you can rest
          assured that your personal and financial data is protected at all
          times.
        </p>

        <Typography component="h1" variant="h6">
          Is Plaid safe to use
        </Typography>
        <p>
          Need For Spend takes security very seriously and has implemented the
          highest industry standards to ensure the safety of your information.
          With Need For Spend, you can easily track your spending across all of
          your accounts and get insights into your financial habits. By
          understanding your spending patterns, you can make better financial
          decisions and achieve your financial goals. Get started with Need For
          Spend today and take control of your finances with confidence and
          security.
        </p>
      </Box>
    </Box>
  )
}

PlaidHome.getLayout = (page: ReactNode) => <MainLayout>{page}</MainLayout>

export default PlaidHome
