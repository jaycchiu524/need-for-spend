import { Request, Response } from 'express'

import { PLAID_PRODUCTS } from '@/configs/app-config'
import { InfoResponse } from '@/info/interfaces'

export const infoController = {
  getServerInfo: async (req: Request, res: Response) => {
    const info: InfoResponse = {
      item_id: 'ITEM_ID',
      access_token: 'ACCESS_TOKEN',
      products: PLAID_PRODUCTS,
    }

    res.status(200).send(info)
  },
}
