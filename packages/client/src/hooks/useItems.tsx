import { useQuery } from '@tanstack/react-query'

import { useCallback } from 'react'

import { getItemById, getItemsByUserId } from '@/api/items'
import { useItemStore } from '@/store/items'

const useItems = ({
  userId,
  itemId,
}: {
  userId: string | null
  itemId: string | null
}) => {
  const { setUserItems, setIdItems } = useItemStore.getState()

  const { data: itemById, refetch: idFetch } = useQuery({
    queryKey: ['itemById', itemId],
    queryFn: () => getItemById(itemId || ''),
    enabled: false,
    cacheTime: 60 * 1000,
  })

  const { data: itemByUser, refetch: userFetch } = useQuery({
    queryKey: ['itemByUserId', userId],
    queryFn: () => getItemsByUserId(userId || ''),
    enabled: false,
    cacheTime: 60 * 1000,
  })

  const fetchItemsByUser = useCallback(
    async (userId: string) => {
      if (itemByUser) return itemByUser.data

      const { data } = await userFetch()

      if (data?.data) {
        setUserItems(userId, data.data)
      }

      return data?.data
    },
    [itemByUser, setUserItems, userFetch],
  )

  const fetchItemById = useCallback(
    async (itemId: string) => {
      if (itemById) return itemById.data

      const { data } = await idFetch()

      if (data?.data) {
        setIdItems(itemId, [data.data])
      }

      return data?.data
    },
    [idFetch, itemById, setIdItems],
  )

  return {
    fetchItemById,
    fetchItemsByUser,
  }
}

export default useItems
