import { Item } from '@/generated/client'

export type CreateItemRequest = {
  publicToken: string
  institutionId: string
  institutionName: string
}

export type GetItemResponse = Omit<Item, 'plaidAccessToken'>
