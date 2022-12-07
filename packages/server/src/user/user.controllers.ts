import { Request, Response } from 'express'

import { CreateUserInput } from './interfaces'
import { userServices } from './user.services'

export const userController = {
  async createUser(req: Request<any, any, CreateUserInput>, res: Response) {
    // req.body.password = await argon2.hash(req.body.password)
    const userId = await userServices.createUser(req.body)
    res.status(201).send({ id: userId })
  },

  async getUsers(req: Request, res: Response) {
    const users = await userServices.getUsers()
    res.status(200).send(users)
  },
}
