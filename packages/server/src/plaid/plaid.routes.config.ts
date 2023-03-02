import debug from 'debug'
import express from 'express'

import { jwtMiddlewares } from '@/common/middlewares/jwt.middleware'

import { linkTokenControllers } from './link-token/link-token.controllers'
import { itemsControllers } from './items/items.controllers'
import { accountsControllers } from './accounts/accounts.controller'
import { itemMiddlewares } from './items/middlewares'
import { institutionsControllers } from './institutions/institutions.controllers'

const debugLog = debug('app: info-routes')

const { validJWTNeeded } = jwtMiddlewares
const { validateItemExists, validateItemBelongsToUser } = itemMiddlewares

export const plaidRoutes = (app: express.Application) => {
  const name = 'plaidRoutes'
  debugLog(`Initializing ${name}`)

  // Link Token
  app
    .route(`/link-token`)
    .all(validJWTNeeded)
    .post(linkTokenControllers.createLinkToken)

  // Items
  app.route(`/items`).all(validJWTNeeded).post(itemsControllers.createItem)

  app
    .route(`/items/:itemId`)
    .all(validJWTNeeded, validateItemExists, validateItemBelongsToUser)
    .get(itemsControllers.getItemById)
    .delete(itemsControllers.deleteItemAndRelatedRecordsById)

  app
    .route(`/items/:itemId/accounts`)
    .all(validJWTNeeded, validateItemExists, validateItemBelongsToUser)
    .get(itemsControllers.getAccountsByItemId)

  // Institutions
  app
    .route(`/institutions/:institutionId`)
    .all(validJWTNeeded)
    .get(institutionsControllers.getInstiutionById)

  // Accounts
  app
    .route(`/accounts/:accountId`)
    .all(validJWTNeeded)
    .get(accountsControllers.getAccountById)

  app
    .route(`/accounts/:accountId/transactions`)
    .all(validJWTNeeded)
    .get(accountsControllers.getTransactionsByAccountId)

  app
    .route(`/accounts/:accountId/expense/monthly`)
    .all(validJWTNeeded)
    .get(accountsControllers.getMonthlyExpenseByAccoundId)

  app
    .route(`/accounts/:accountId/expense/daily`)
    .all(validJWTNeeded)
    .get(accountsControllers.getDailyExpenseByAccoundId)

  return app
}
