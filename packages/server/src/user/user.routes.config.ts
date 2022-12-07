import debug from 'debug'
import express from 'express'

import { userController } from './user.controllers'

const debugLog = debug('app: info-routes')

export const userRoutes = (app: express.Application) => {
  const name = 'User Routes'

  debugLog(`Initializing ${name}`)

  app.route(`/users`).get(userController.getUsers)
  app.route(`/users`).post(userController.createUser)
  return app
}
