import { Request, Response } from 'express'
import { LinkTokenCreateRequest, LinkTokenGetRequest } from 'plaid'
import debug from 'debug'

import { JWT } from '@/auth/dto.types'

import { itemsServices } from '@/plaid/items/services'

import {
  PLAID_ANDROID_PACKAGE_NAME,
  PLAID_COUNTRY_CODES,
  PLAID_PRODUCTS,
  PLAID_REDIRECT_URI,
  plaid,
  PLAID_WEBHOOK,
  PLAID_ENV,
} from '../plaid'

import { LinkTokenRequest } from './types'

const log = debug('app: link-token-controller')

export const getLinkToken = async (req: Request, res: Response) => {
  try {
    const configs: LinkTokenGetRequest = {
      link_token: req.body.linkToken,
    }
    const getTokenResponse = await plaid.linkTokenGet(configs)
    log(getTokenResponse)
    res.json(getTokenResponse.data)
  } catch (err) {
    log(err)
    res.json(err)
  }
}

const createLinkToken = async (
  req: Request<any, LinkTokenRequest>,
  res: Response<any, { jwt: JWT }>,
) => {
  let accessToken: string | undefined = undefined
  let webhookUrl: string | undefined = PLAID_WEBHOOK

  if (PLAID_ENV === 'sandbox') {
    const response = await fetch('http://ngrok:4040/api/tunnels')
    if (!response.ok) {
      throw new Error('Failed to get ngrok tunnels')
    }
    // name: 'command_line (http)',
    // uri: '/api/tunnels/command_line%20%28http%29',
    // public_url: 'http://1c84-99-246-69-188.ngrok.io', <-- this is the one we want
    // proto: 'http',
    // config: { addr: 'http://api:8080', inspect: true },
    // metrics: { conns: [Object], http: [Object] }
    const { tunnels } = await response.json()
    const httpTunnel = tunnels.find((t: any) => t.proto === 'http')
    webhookUrl = httpTunnel.public_url + '/webhook'
  }

  try {
    if (req.body.itemId) {
      const getItemResponse = await itemsServices.getItemById(req.body.itemId)
      log(getItemResponse)
      if (getItemResponse) {
        accessToken = getItemResponse.plaidAccessToken || undefined
      }
    }

    const configs: LinkTokenCreateRequest = {
      user: {
        // This should correspond to a unique id for the current user.
        client_user_id: req.body.userId,
      },
      client_name: 'Need For Spend',
      products: PLAID_PRODUCTS,
      country_codes: PLAID_COUNTRY_CODES,
      language: 'en',
      access_token: accessToken,
      webhook: webhookUrl,
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
