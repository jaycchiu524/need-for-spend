import debug from 'debug'
import { Request, Response } from 'express'
import {
  ItemWebhookUpdateResponse,
  SandboxItemFireWebhookRequestWebhookCodeEnum,
} from 'plaid'

import { itemsServices } from '../items/services'

import { plaid } from '../plaid'

const log = debug('app: webhook')

export const webhookHandler = async (req: Request, res: Response) => {
  const {
    webhook_code: webhookCode,
    item_id: plaidItemId,
    error,
  } = req.body as ItemWebhookUpdateResponse

  log('webhookHandler', req.body)
}

export const sandboxWebhook = async (req: Request, res: Response) => {
  let accessToken: string | undefined = undefined

  if (!req.body.itemId) {
    return res.status(400).json({ message: 'itemId is required' })
  }
  const getItemResponse = await itemsServices.getItemByPlaidItemId(
    req.body.itemId,
  )
  console.log(getItemResponse)
  if (getItemResponse) {
    accessToken = getItemResponse.plaidAccessToken || undefined
  }

  if (!accessToken) {
    return res.status(400).json({ message: 'No access token found' })
  }

  try {
    const fireWebhookResponse = await fireWebhook(accessToken)
    console.log(fireWebhookResponse)
    res.json(fireWebhookResponse)
  } catch (err) {
    console.log(err)
    res.json(err)
  }
}

// Fire a DEFAULT_UPDATE webhook for an Item
const fireWebhook = async (access_token: string) => {
  const response = await plaid.sandboxItemFireWebhook({
    access_token: access_token,
    webhook_code:
      SandboxItemFireWebhookRequestWebhookCodeEnum.SyncUpdatesAvailable,
  })

  return response.data
}
