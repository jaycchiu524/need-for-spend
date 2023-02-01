import { PlaidLinkOnSuccessMetadata } from 'react-plaid-link'

import { Item } from '@/api/types'

export type CreateLinkTokenResponse = {
  link_token: string
}

export type ExchangeAccessTokenRequest = {
  publicToken: string
  accounts: PlaidLinkOnSuccessMetadata['accounts']
  institutionId: string
  institutionName: string
}

export type ExchangeAccessTokenResponse = Item
