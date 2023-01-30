import { Request, Response } from 'express'
import { LinkTokenCreateRequest, LinkTokenGetRequest } from 'plaid'
import debug from 'debug'

import { JWT } from '@/auth/dto.types'

import {
  PLAID_ANDROID_PACKAGE_NAME,
  PLAID_COUNTRY_CODES,
  PLAID_PRODUCTS,
  PLAID_REDIRECT_URI,
  plaid,
} from '../plaid'

const log = debug('app: link-token-controller')

export const getLinkToken = async (req: Request, res: Response) => {
  try {
    const configs: LinkTokenGetRequest = {
      link_token: req.body.linkToken,
    }
    const createTokenResponse = await plaid.linkTokenGet(configs)
    log(createTokenResponse)
    res.json(createTokenResponse.data)
  } catch (err) {
    log(err)
    res.json(err)
  }
}

const createLinkToken = async (
  req: Request,
  res: Response<any, { jwt: JWT }>,
) => {
  try {
    const configs: LinkTokenCreateRequest = {
      user: {
        // This should correspond to a unique id for the current user.
        client_user_id: res.locals.jwt.id,
      },
      client_name: 'Fin-me',
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
    const createTokenResponse = await plaid.linkTokenCreate(configs)
    log(createTokenResponse)

    res.status(200).json({
      link_token: createTokenResponse.data.link_token,
    })
  } catch (err) {
    log(err)
    res.status(500).json({
      code: 500,
      message: 'Could not create link token, please try again later',
    })
  }
}

export const linkTokenControllers = {
  getLinkToken,
  createLinkToken,
}
