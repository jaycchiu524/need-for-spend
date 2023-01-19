import debug from 'debug'

import { authControllers } from './auth.controllers'

import { jwtMiddlewares } from './middlewares/jwt.middleware'

import { authMiddlewares } from './middlewares/auth.middleware'

import type { Application } from 'express'

const log = debug('app: auth-routes')

const { validJWTNeeded, verifyRefreshBodyField, validRefreshNeeded } =
  jwtMiddlewares
const { register, login } = authControllers
const { validateNoSameEmail, verifyUserPassword } = authMiddlewares

export const authRoutes = (app: Application) => {
  const name = 'Auth Routes'

  log(`Initializing ${name}`)

  // Register
  app.route(`/auth/register`).post(validateNoSameEmail, register, login)

  // Login
  app.route(`/auth/login`).post(verifyUserPassword, login)

  // Refresh token
  app
    .route(`/auth/refresh-token`)
    .post(validJWTNeeded, verifyRefreshBodyField, validRefreshNeeded, login)

  return app
}
