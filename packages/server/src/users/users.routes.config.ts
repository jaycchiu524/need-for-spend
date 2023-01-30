import debug from 'debug'
import express from 'express'

import { jwtMiddlewares } from '@/common/middlewares/jwt.middleware'
import { permissionMiddlewares } from '@/common/middlewares/permission.middleware'
import { Role } from '@/common/types/permission.enum'

import { usersController } from './users.controllers'

import { usersMiddlewares } from './users.middlewares'

const debugLog = debug('app: users-routes')

const { validJWTNeeded } = jwtMiddlewares
const {
  getUsers,
  createUser,
  getUserById,
  updateUserInfo,
  getAccountsByUserId,
  getItemsByUserId,
  getTransactionsByUserId,
} = usersController
const { validateNoSameEmail, validateUserExists, extractUserId } =
  usersMiddlewares
const { roleRequired, onlySameUserOrAdmin } = permissionMiddlewares

export const usersRoutes = (app: express.Application) => {
  const name = 'User Routes'

  debugLog(`Initializing ${name}`)

  /** GET /users */
  app.route(`/users`).get(
    // JWT authentication
    validJWTNeeded,
    // Permission check
    roleRequired(Role.ADMIN),
    // Get all users
    getUsers,
  )

  /** POST /users*/
  app.route(`/users`).post(
    // Validate no same email
    validateNoSameEmail,
    // Validate request body & Create a new user
    createUser,
  )

  // Utils - Extract user id from params to body
  app.param(`userId`, extractUserId)

  /** /users/:userId */
  app
    .route(`/users/:userId`)
    .all(
      // Validate that the user exists
      validateUserExists,
      // JWT authentication
      validJWTNeeded,
      // Permission check
      onlySameUserOrAdmin,
    )
    .get(getUserById)
    .put(updateUserInfo)

  /** /users/:userId/:<assets> */
  app
    .route(`/users/:userId/accounts`)
    .all(
      // Validate that the user exists
      validateUserExists,
      // JWT authentication
      validJWTNeeded,
      // Permission check
      onlySameUserOrAdmin,
    )
    .get(getAccountsByUserId)

  app
    .route(`/users/:userId/items`)
    .all(
      // Validate that the user exists
      validateUserExists,
      // JWT authentication
      validJWTNeeded,
      // Permission check
      onlySameUserOrAdmin,
    )
    .get(getItemsByUserId)

  app
    .route(`/users/:userId/transactions`)
    .all(
      // Validate that the user exists
      validateUserExists,
      // JWT authentication
      validJWTNeeded,
      // Permission check
      onlySameUserOrAdmin,
    )
    .get(getTransactionsByUserId)

  return app
}
