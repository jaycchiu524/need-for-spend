import debug from 'debug'

import { authControllers } from './auth.controllers'

import { jwtMiddlewares } from './middlewares/jwt.middleware'

import { authMiddlewares } from './middlewares/auth.middleware'

import type { Application } from 'express'

const log = debug('app: auth-routes')

const { validJWTNeeded, verifyRefreshBodyField, validRefreshNeeded } =
  jwtMiddlewares

export const authRoutes = (app: Application) => {
  const name = 'Auth Routes'

  log(`Initializing ${name}`)

  // Login
  app
    .route(`/auth/login`)
    .post(authMiddlewares.verifyUserPassword, authControllers.login)

  // Refresh token
  app
    .route(`/auth/refresh-token`)
    .post(
      validJWTNeeded,
      verifyRefreshBodyField,
      validRefreshNeeded,
      authControllers.login,
    )

  return app
}
