import { NextFunction, Request, Response } from 'express'

import debug from 'debug'

import { JWT } from '@/auth/dto.types'

import { itemsServices } from './services'

const log = debug('app: item-middlewares')

/**
 * @description Use after validJWTNeeded, validate if the item exists
 */
const validateItemExists = async (
  req: Request<{ itemId: string }>,
  res: Response<any, { jwt: JWT } & { userIdByItem: string }>,
  next: NextFunction,
) => {
  const itemId = req.params.itemId
  const item = await itemsServices.getItemById(itemId)
  if (!item) {
    log('Item not found: %o', itemId)
    return res.status(404).send({
      code: 404,
      message: 'Item not found',
    })
  }

  res.locals.userIdByItem = item.userId!
  next()
}

/**
 * @description Use after validJWTNeeded & validateItemExists, validate if the item belongs to the user
 */
const validateItemBelongsToUser = async (
  req: Request<{ itemId: string }>,
  res: Response<any, { jwt: JWT } & { userIdByItem: string }>,
  next: NextFunction,
) => {
  const userIdByItem = res.locals.userIdByItem
  const userId = res.locals.jwt.id

  if (userIdByItem !== userId) {
    log('Forbidden: %o', userIdByItem, userId)
    return res.status(403).send({
      code: 403,
      message: 'Forbidden',
    })
  }
  next()
}

export const itemMiddlewares = {
  validateItemExists,
  validateItemBelongsToUser,
}
