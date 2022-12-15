import debug from 'debug'
import express from 'express'

import { usersMiddlewares } from './middlewares'

import { usersController } from './users.controllers'

const debugLog = debug('app: info-routes')

export const usersRoutes = (app: express.Application) => {
  const name = 'User Routes'

  debugLog(`Initializing ${name}`)

  app.route(`/users`).get(usersController.getUsers)
  app
    .route(`/users`)
    .post(usersMiddlewares.validateNoSameEmail, usersController.createUser)
  return app
}
