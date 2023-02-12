import { Request, Response } from 'express'

import debug from 'debug'

import argon2 from 'argon2'

import { itemsServices } from '@/plaid/items/services'

import { accountsServices } from '@/plaid/accounts/services'

import {
  GetTransactionsQuery,
  transactionsServices,
} from '@/plaid/transactions/services'

import { User, UserInfo } from './dao'
import { usersServices } from './users.services'
import { userInfoUpdateSchema, userSchema } from './users.joi'

const log: debug.IDebugger = debug('app: user-controller')

/**
 * Create a new user
 * @param req
 * @param res
 * @returns response with the id of the new user; 400 if the request body is invalid
 */
const createUser = async (req: Request<any, any, User>, res: Response) => {
  const validate = userSchema.validate(req.body)
  if (validate.error) {
    return res.status(400).send({
      code: 400,
      message: validate.error.details[0].message,
    })
  }

  req.body.password = await argon2.hash(req.body.password)
  const user = await usersServices.createUser(req.body)
  log(user.id)
  return res.status(201).send({ id: user.id })
}

/**
 * Get all users
 * @param req Query parameters: take, skip
 * @param res
 * @returns response with the users array
 */
const getUsers = async (req: Request, res: Response) => {
  const users = await usersServices.getUsers({
    take: Number(req.query.take) || 20,
    skip: Number(req.query.skip) || 0,
  })
  return res.status(200).send(users)
}

/**
 * Get a user by id
 * @param req
 * @param res
 * @returns response with the user; 404 if the user is not found
 */
const getUserById = async (req: Request<{ userId: string }>, res: Response) => {
  const user = await usersServices.getUserById(req.params.userId)
  if (!user) {
    return res.status(404).send({
      code: 404,
      message: 'User not found',
    })
  }
  return res.status(200).send(user)
}

const updateUserInfo = async (
  req: Request<{ userId: string }, any, UserInfo>,
  res: Response,
) => {
  const validate = userInfoUpdateSchema.validate(req.body)

  log('validate', validate)

  if (validate.error) {
    log('validate.error', validate.error)

    return res.status(400).send({
      code: 400,
      message: validate.error.details[0].message,
    })
  }

  const user = await usersServices.updateUserInfo(req.params.userId, req.body)
  return res.status(200).send(user)
}

const getItemsByUserId = async (
  req: Request<{ userId: string }>,
  res: Response,
) => {
  try {
    const items = await itemsServices.getItemsByUserId(req.params.userId)

    return res.status(200).send(items)
  } catch (err) {
    log('Error: Internal get items by user id: %o', err)
    return res.status(500).send({
      code: 500,
      message: 'Internal Server Error',
    })
  }
}

const getAccountsByUserId = async (
  req: Request<{ userId: string }>,
  res: Response,
) => {
  try {
    const accounts = await accountsServices.getAccountsByUserId(
      req.params.userId,
    )

    return res.status(200).send(accounts)
  } catch (err) {
    log('Error: Internal get accounts by user id: %o', err)
    return res.status(500).send({
      code: 500,
      message: 'Internal Server Error',
    })
  }
}

const getTransactionsByUserId = async (
  req: Request<{ userId: string }, any, any, GetTransactionsQuery>,
  res: Response,
) => {
  try {
    const query = req.query

    const transactions = await transactionsServices.getTransactionsByUserId(
      req.params.userId,
      query
        ? {
            take: Number(query.take),
            skip: Number(query.skip),
            where: {
              date: {
                lte: query.endDate,
                gte: query.startDate,
              },
            },
          }
        : {},
    )

    return res.status(200).send(transactions)
  } catch (err) {
    log('Error: Internal get transactions by user id: %o', err)
    return res.status(500).send({
      code: 500,
      message: 'Internal Server Error',
    })
  }
}

export const usersController = {
  createUser,
  getUsers,
  getUserById,
  updateUserInfo,

  // items
  getItemsByUserId,
  // accounts
  getAccountsByUserId,
  // transactions
  getTransactionsByUserId,
}
