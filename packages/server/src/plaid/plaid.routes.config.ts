import debug from 'debug'
import express from 'express'

import { jwtMiddlewares } from '@/common/middlewares/jwt.middleware'

import { linkTokenControllers } from './link-token/link-token.controllers'
import { itemsControllers } from './items/items.controllers'

const debugLog = debug('app: info-routes')

const { validJWTNeeded } = jwtMiddlewares

export const plaidRoutes = (app: express.Application) => {
  const name = 'plaidRoutes'

  debugLog(`Initializing ${name}`)

  app
    .route(`/link-token`)
    .all(validJWTNeeded)
    .post(linkTokenControllers.createLinkToken)

  app.route(`/items`).all(validJWTNeeded).post(itemsControllers.createItem)

  return app
}
