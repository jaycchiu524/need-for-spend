import { Request, Response } from 'express'

import debug from 'debug'

import { JWT } from '@/auth/dto.types'

import { plaid } from '../plaid'

import { transactionsServices } from '../transactions/services'

import { accountsServices } from '../accounts/services'

import { CreateItemRequest } from './types'

import { itemsServices } from './services'

const log = debug('app: item-controllers')

const getItemById = async (
  req: Request<{ itemId: string }>,
  res: Response<any, { jwt: JWT }>,
) => {
  try {
    const itemId = req.params.itemId

    const item = await itemsServices.getItemById(itemId)
    if (!item) {
      return res.status(404).send({
        code: 404,
        message: 'Item not found',
      })
    }

    const userId = res.locals.jwt.id
    if (item.userId !== userId) {
      return res.status(403).send({
        code: 403,
        message: 'Forbidden',
      })
    }

    // eslint-disable-next-line unused-imports/no-unused-vars
    const { plaidAccessToken, ...rest } = item
    // @type: GetItemResponse
    return res.status(200).send(rest)
  } catch (err) {
    log('Error: Internal get item by plaid item id: %o', err)

    return res.status(500).send({
      code: 500,
      message: 'Internal Server Error',
    })
  }
}

const createItem = async (
  req: Request<any, any, CreateItemRequest>,
  res: Response<any, { jwt: JWT }>,
) => {
  const PUBLIC_TOKEN = req.body.publicToken
  try {
    const tokenResponse = await plaid.itemPublicTokenExchange({
      public_token: PUBLIC_TOKEN,
    })

    log(tokenResponse)
    const ACCESS_TOKEN = tokenResponse.data.access_token
    const ITEM_ID = tokenResponse.data.item_id
    // if (PLAID_PRODUCTS.includes(Products.Transfer)) {
    //   TRANSFER_ID = await authorizeAndCreateTransfer(ACCESS_TOKEN)
    // }

    // Create item record in database
    const item = await itemsServices.createItem({
      plaidItemId: ITEM_ID,
      plaidAccessToken: ACCESS_TOKEN,
      plaidInstitutionId: req.body.institutionId,
      plaidInstitutionName: req.body.institutionName,
      userId: res.locals.jwt.id,
      transactionsCursor: null,
    })

    await transactionsServices.updateTransactions(ITEM_ID)

    res.status(200).send({
      itemId: item.id,
      plaidInstitution: req.body.institutionName,
    })
  } catch (error) {
    log('Create item: %o', error)

    return res.status(500).send({
      code: 500,
      message: 'Internal Server Error',
    })
  }
}

const getAccountsByItemId = async (
  req: Request<{ itemId: string }>,
  res: Response<any, { jwt: JWT }>,
) => {
  try {
    const itemId = req.params.itemId

    const item = await itemsServices.getItemById(itemId)
    if (!item) {
      return res.status(404).send({
        code: 404,
        message: 'Item not found',
      })
    }

    const userId = res.locals.jwt.id
    if (item.userId !== userId) {
      return res.status(403).send({
        code: 403,
        message: 'Forbidden',
      })
    }

    const accounts = await accountsServices.getAccountsByItemId(itemId)

    return res.status(200).send(accounts)
  } catch (err) {
    log('Error: Internal get item by plaid item id: %o', err)

    return res.status(500).send({
      code: 500,
      message: 'Internal Server Error',
    })
  }
}

export const itemsControllers = {
  getItemById,
  createItem,
  getAccountsByItemId,
}
