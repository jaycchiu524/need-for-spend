import { NextFunction, Request, Response } from 'express'
import { LinkTokenCreateRequest, PlaidApi } from 'plaid'
import debug from 'debug'

import {
  PLAID_ANDROID_PACKAGE_NAME,
  PLAID_COUNTRY_CODES,
  PLAID_PRODUCTS,
  PLAID_REDIRECT_URI,
} from '@/configs/app-config'

const log = debug('app: create-link-token')

export const createLinkToken =
  (client: PlaidApi) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const configs: LinkTokenCreateRequest = {
      user: {
        // This should correspond to a unique id for the current user.
        client_user_id: 'user-id',
      },
      client_name: 'Plaid Quickstart',
      products: PLAID_PRODUCTS,
      country_codes: PLAID_COUNTRY_CODES,
      language: 'en',
    }

    if (PLAID_REDIRECT_URI !== '') {
      configs.redirect_uri = PLAID_REDIRECT_URI
    }

    if (PLAID_ANDROID_PACKAGE_NAME !== '') {
      configs.android_package_name = PLAID_ANDROID_PACKAGE_NAME
    }
    const createTokenResponse = await client.linkTokenCreate(configs)
    log(createTokenResponse)

    res.status(200).json({
      link_token: createTokenResponse.data.link_token,
    })
  }
