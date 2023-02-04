import { AxiosError } from 'axios'

import { ErrorResponse, Item } from '@/api/types'

import { fetcher } from '@/api/fetcher'

export type ItemType = Omit<Item, 'plaidAccessToken'>
type GetItemByIdResponse = ItemType
type GetItemsByUserIdResponse = ItemType[]

export const getItemById = async (itemId: string) => {
  try {
    const api = await fetcher()
    if (!api) return
    const response = await api.get<GetItemByIdResponse>(`/items/${itemId}`)
    return response
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>
    throw error
  }
}
export const getItemsByUserId = async (userId: string) => {
  try {
    const api = await fetcher()
    if (!api) return
    const response = await api.get<GetItemsByUserIdResponse>(
      `/users/${userId}/items`,
    )
    return response
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>
    throw error
  }
}
