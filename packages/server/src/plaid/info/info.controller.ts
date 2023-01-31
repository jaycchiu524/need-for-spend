import { Request, Response } from 'express'

import { InfoResponse } from '@/plaid/info/interfaces'

import { PLAID_PRODUCTS, PLAID_REDIRECT_URI } from '../plaid'

export const infoController = {
  getServerInfo: async (req: Request, res: Response) => {
    const info: InfoResponse = {
      env: process.env.PLAID_ENV || 'sandbox',
      redirect_uri: PLAID_REDIRECT_URI,
      products: PLAID_PRODUCTS,
    }

    res.status(200).send(info)
  },
}
