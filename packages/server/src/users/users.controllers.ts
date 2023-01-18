import { Request, Response } from 'express'

import debug from 'debug'

import argon2 from 'argon2'

import { User, UserInfo } from './dao'
import { usersServices } from './users.services'
import { userInfoUpdateSchema, userSchema } from './users.joi'

const log: debug.IDebugger = debug('app: user-controller')

export const usersController = {
  /**
   * Create a new user
   * @param req
   * @param res
   * @returns response with the id of the new user; 400 if the request body is invalid
   */
  async createUser(req: Request<any, any, User>, res: Response) {
    const validate = userSchema.validate(req.body)
    if (validate.error) {
      return res.status(400).send({
        code: 400,
        message: validate.error.details[0].message,
      })
    }

    req.body.password = await argon2.hash(req.body.password)
    const userId = await usersServices.createUser(req.body)
    log(userId)
    return res.status(201).send({ id: userId })
  },

  /**
   * Get all users
   * @param req
   * @param res
   * @returns response with the users
   */
  async getUsers(
    req: Request<any, any, any, { take?: number; skip: number }>,
    res: Response,
  ) {
    const users = await usersServices.getUsers({
      take: Number(req.query.take) || 20,
      skip: Number(req.query.skip) || 0,
    })
    return res.status(200).send(users)
  },

  /**
   * Get a user by id
   * @param req
   * @param res
   * @returns response with the user; 404 if the user is not found
   */
  async getUserById(req: Request<{ userId: string }>, res: Response) {
    const user = await usersServices.getUserById(req.params.userId)
    if (!user) {
      return res.status(404).send({
        code: 404,
        message: 'User not found',
      })
    }
    return res.status(200).send(user)
  },

  async updateUserInfo(
    req: Request<{ userId: string }, any, UserInfo>,
    res: Response,
  ) {
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
  },
}
