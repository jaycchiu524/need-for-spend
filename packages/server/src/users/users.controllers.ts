import { Request, Response } from 'express'

import debug from 'debug'

import argon2 from 'argon2'

import { User } from './dao'
import { usersServices } from './users.services'
import { userSchema } from './joi'

const log: debug.IDebugger = debug('app: user-controller')

export const usersController = {
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
}
