import debug from 'debug'
import { Request, Response } from 'express'
import { ItemWebhookUpdateResponse } from 'plaid'

import {
  SocketIOServer,
  TransactionWebhookEvents,
} from '@/common/types/sockets.type'

import { itemsServices } from '../items/services'

import { transactionsServices } from '../transactions/services'

import { fireWebhook } from './services'

const log = debug('app: webhook')

export const webhookHandler =
  (io: SocketIOServer) => async (req: Request, res: Response) => {
    const {
      webhook_code: webhookCode,
      item_id: plaidItemId,
      error,
    } = req.body as ItemWebhookUpdateResponse

    log('webhookHandler', req.body)

    if (error) {
      log('webhookHandler error', error)
      return res.status(500).json({ error })
    }

    switch (webhookCode) {
      case TransactionWebhookEvents.SYNC_UPDATES_AVAILABLE:
        log('webhookHandler SYNC_UPDATES_AVAILABLE')
        const { addedCount, modifiedCount, removedCount } =
          await transactionsServices.updateTransactions(plaidItemId)
        io.emit(
          'SYNC_UPDATES_AVAILABLE',
          `Transactions: ${addedCount} added, ${modifiedCount} modified, ${removedCount} removed ${plaidItemId}`,
        )
        break
      default:
        log('webhookHandler unhandled webhookCode', webhookCode)
        break
    }
  }

export const sandboxWebhook = async (req: Request, res: Response) => {
  let accessToken: string | undefined = undefined

  if (!req.body.itemId) {
    return res.status(400).json({ message: 'itemId is required' })
  }
  const getItemResponse = await itemsServices.getItemByPlaidItemId(
    req.body.itemId,
  )
  if (getItemResponse) {
    accessToken = getItemResponse.plaidAccessToken || undefined
  }
  if (!accessToken) {
    return res.status(400).json({ message: 'No access token found' })
  }

  try {
    const fireWebhookResponse = await fireWebhook(
      accessToken,
      req.body.webhookCode,
    )
    log(fireWebhookResponse)
    res.json(fireWebhookResponse)
  } catch (err) {
    log(err)
    res.json(err)
  }
}
