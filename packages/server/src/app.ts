import * as http from 'http'

import express from 'express'

import dotenv from 'dotenv'

import { initExpress, APP_PORT } from './configs/app-config'
import { infoRoutes } from './plaid/info/info.routes.config'
import { plaidRoutes } from './plaid/plaid.routes.config'
import { usersRoutes } from './users/users.routes.config'
import { authRoutes } from './auth/auth.routes.config'

dotenv.config()

const app = initExpress()
const server: http.Server = http.createServer(app)

// Routes
infoRoutes(app)
plaidRoutes(app)
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
