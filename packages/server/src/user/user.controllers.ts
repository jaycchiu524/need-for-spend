import { Request, Response } from 'express'

import debug from 'debug'

import argon2 from 'argon2'

import { User } from './dao'
import { userServices } from './user.services'

const log: debug.IDebugger = debug('app: user-controller')

export const userController = {
  async createUser(req: Request<any, any, User>, res: Response) {
    req.body.password = await argon2.hash(req.body.password)
    const userId = await userServices.createUser(req.body)
    log(userId)
    res.status(201).send({ id: userId })
  },

  async getUsers(
    req: Request<any, any, any, { take?: number; skip: number }>,
    res: Response,
  ) {
    const users = await userServices.getUsers({
      take: req.query.take || 20,
      skip: req.query.skip || 0,
    })
    res.status(200).send(users)
  },
}
