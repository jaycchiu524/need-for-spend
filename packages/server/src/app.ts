import * as http from 'http'

import express from 'express'

import dotenv from 'dotenv'

import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid'

import {
  initExpress,
  APP_PORT,
  PLAID_CLIENT_ID,
  PLAID_ENV,
  PLAID_SECRET,
} from './configs/app-config'
import { infoRoutes } from './info/info.routes.config'
import { plaidRoutes } from './plaid/plaid.routes.config'
import { usersRoutes } from './users/users.routes.config'
import { authRoutes } from './auth/auth.routes.config'

dotenv.config()

const app = initExpress()
const server: http.Server = http.createServer(app)

// We store the access_token in memory - in production, store it in a secure
// persistent data store
const ACCESS_TOKEN = null
const PUBLIC_TOKEN = null
const ITEM_ID = null
// The payment_id is only relevant for the UK/EU Payment Initiation product.
// We store the payment_id in memory - in production, store it in a secure
// persistent data store along with the Payment metadata, such as userId .
const PAYMENT_ID = null
// The transfer_id is only relevant for Transfer ACH product.
// We store the transfer_id in memory - in production, store it in a secure
// persistent data store
const TRANSFER_ID = null

// Find your API keys in the Dashboard (https://dashboard.plaid.com/account/keys)
const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
      'Plaid-Version': '2020-09-14',
    },
  },
})

// Initialize the Plaid client
const client = new PlaidApi(configuration)

// Routes
infoRoutes(app)
plaidRoutes(app, client)
usersRoutes(app)
authRoutes(app)

const runningMessage = `Server running at http://localhost:${APP_PORT}`
app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).send(runningMessage)
})

export default server.listen(APP_PORT, () => {
  // our only exception to avoiding console.log(), because we
  // always want to know when the server is done starting up
  console.log(runningMessage)
})
