import debug from 'debug'
import express from 'express'
import { PlaidApi } from 'plaid'

import { PlaidServices } from './services/plaid-services'

const debugLog = debug('app: info-routes')

export const plaidRoutes = (app: express.Application, client: PlaidApi) => {
  const name = 'plaidRoutes'

  debugLog(`Initializing ${name}`)

  app
    .route(`/plaid/create-link-token`)
    .post(PlaidServices.createLinkToken(client))

  app
    .route(`/plaid/exchange-access-token`)
    .post(PlaidServices.exchangeAccessToken(client))
  return app
}
