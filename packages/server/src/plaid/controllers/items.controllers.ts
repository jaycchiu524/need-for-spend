import { Request, Response } from 'express'

import debug from 'debug'

import { JWT } from '@/auth/dto.types'

import { plaid } from '../plaid'

import { CreateItemRequest } from '../interfaces'

import { PlaidServices } from '../plaid-services'

const log = debug('app: create-item')

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
    const item = await PlaidServices.createItem({
      plaidItemId: ITEM_ID,
      plaidAccessToken: ACCESS_TOKEN,
      plaidInstitutionId: req.body.institutionId,
      plaidInstitutionName: req.body.institutionName,
      userId: res.locals.jwt.id,
    })

    res.status(200).send({
      item,
    })
  } catch (error) {
    const msg = 'Could not exchange public token for access token'
    log('%o: %o', msg, error)

    return res.status(500).send({
      code: 500,
      message: msg,
    })
  }
}

export const itemsControllers = {
  createItem,
}
