import { AxiosError } from 'axios'

import { fetcher } from '@/api/fetcher'

import { ErrorResponse } from '@/api/types'

export const fireSandboxWebhook = async (itemId: string) => {
  try {
    const api = await fetcher()
    if (!api) return
    const response = await api.post(`/sandbox/webhook`, { itemId })
    return response
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>
    throw error
  }
}
