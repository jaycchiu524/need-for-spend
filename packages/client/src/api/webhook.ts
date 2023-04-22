import { AxiosError } from 'axios'

import { fetcher } from '@/api/fetcher'

import { ErrorResponse } from '@/api/types'

// From plaid API
export enum SandboxItemFireWebhookRequestWebhookCodeEnum {
  DefaultUpdate = 'DEFAULT_UPDATE',
  NewAccountsAvailable = 'NEW_ACCOUNTS_AVAILABLE',
  AuthDataUpdate = 'AUTH_DATA_UPDATE',
  RecurringTransactionsUpdate = 'RECURRING_TRANSACTIONS_UPDATE',
  SyncUpdatesAvailable = 'SYNC_UPDATES_AVAILABLE',
}

// ! For testing purposes only
export const fireSandboxWebhook = async (
  itemId: string,
  webhookCode?: SandboxItemFireWebhookRequestWebhookCodeEnum,
) => {
  try {
    const api = await fetcher()
    if (!api) return
    const response = await api.post(`/sandbox/webhook`, {
      itemId,
      webhookCode,
    })
    return response
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>
    throw error
  }
}
