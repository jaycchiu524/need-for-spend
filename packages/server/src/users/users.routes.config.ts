import debug from 'debug'
import express from 'express'

import { usersMiddlewares } from './middlewares'

import { usersController } from './users.controllers'

const debugLog = debug('app: info-routes')

export const usersRoutes = (app: express.Application) => {
  const name = 'User Routes'

  debugLog(`Initializing ${name}`)

  // Get all users
  app.route(`/users`).get(usersController.getUsers)

  // Get a user by id
  app.route(`/users/:userId`).get(usersController.getUserById)

  // Create a new user
  app
    .route(`/users`)
    .post(usersMiddlewares.validateNoSameEmail, usersController.createUser)

  return app
}
