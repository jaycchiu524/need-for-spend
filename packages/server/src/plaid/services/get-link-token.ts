import { NextFunction, Request, Response } from 'express'
import { LinkTokenGetRequest, PlaidApi } from 'plaid'
import debug from 'debug'

const log = debug('app: get-link-token')

export const getLinkToken =
  (client: PlaidApi) =>
  async (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve()
      .then(async function () {
        const configs: LinkTokenGetRequest = {
          link_token: req.body.linkToken,
        }
        const createTokenResponse = await client.linkTokenGet(configs)
        log(createTokenResponse)
        res.json(createTokenResponse.data)
      })
      .catch(next)
  }
