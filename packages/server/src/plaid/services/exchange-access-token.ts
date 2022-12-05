import {
  PLAID_ANDROID_PACKAGE_NAME,
  PLAID_COUNTRY_CODES,
  PLAID_PRODUCTS,
  PLAID_REDIRECT_URI,
} from '@/common/config'
import { NextFunction, Request, Response } from 'express'
import { LinkTokenCreateRequest, PlaidApi, Products } from 'plaid'
import debug from 'debug'
import { PlaidServices } from './plaid-services'

const log = debug('app: exchange-access-token')

export const exchangeAccessToken =
  (client: PlaidApi) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const PUBLIC_TOKEN = req.body.public_token
    Promise.resolve()
      .then(async function () {
        const tokenResponse = await client.itemPublicTokenExchange({
          public_token: PUBLIC_TOKEN,
        })

        log(tokenResponse)
        const ACCESS_TOKEN = tokenResponse.data.access_token
        const ITEM_ID = tokenResponse.data.item_id
        // if (PLAID_PRODUCTS.includes(Products.Transfer)) {
        //   TRANSFER_ID = await authorizeAndCreateTransfer(ACCESS_TOKEN)
        // }
        res.json({
          // the 'access_token' is a private token, DO NOT pass this token to the frontend in your production environment
          access_token: ACCESS_TOKEN,
          item_id: ITEM_ID,
          error: null,
        })
      })
      .catch((error) => {
        const msg = 'Could not exchange public_token!'
        console.log(msg + '\n' + JSON.stringify(error))
        return res.json({
          error: msg,
        })
      })
  }
