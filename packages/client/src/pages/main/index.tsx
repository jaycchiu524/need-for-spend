import React, { ReactNode, useEffect, useState } from 'react'

import Button from '@mui/material/Button'

import useLink from '@/hooks/useLink'

import useItems from '@/hooks/useItems'

import MainLayout from '@/components/main/MainLayout'
import { useItemStore } from '@/store/items'
import { useLinkTokenStore } from '@/store/link-token'
import { useAuthStore } from '@/store/auth'
import LaunchLink from '@/components/LaunchLink'
import ItemCard from '@/components/ItemCard/ItemCard'

function PlaidHome() {
  const userId = useAuthStore.getState().auth?.id
  const userItem = useItemStore().byUser
  const { users } = useLinkTokenStore.getState()
  const { generateLinkToken } = useLink()
  const { fetchItemsByUser } = useItems({ userId: userId!, itemId: null })

  const initialToken = async () => {
    if (!userId) return null
    await generateLinkToken(userId, null)
  }

  useEffect(() => {
    if (!userId) return
    fetchItemsByUser(userId)
  }, [userId, fetchItemsByUser])

  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const items = userItem[userId!] || []

  console.log(items)

  return (
    <div>
      <Button
        variant="outlined"
        onClick={initialToken}
        disabled={!!(userId && users[userId])}>
        Connect a bank account
      </Button>

      {userId && users[userId] && (
        <LaunchLink userId={userId} itemId={null} linkToken={users[userId]} />
      )}

      {mounted && items.map((item) => <ItemCard key={item.id} item={item} />)}
    </div>
  )
}

PlaidHome.getLayout = (page: ReactNode) => <MainLayout>{page}</MainLayout>

export default PlaidHome
