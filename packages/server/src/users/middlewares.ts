import { Request, Response, NextFunction } from 'express'

import { usersServices } from './users.services'

const validateNoSameEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email } = req.body
  const user = await usersServices.getUserByEmail(email)
  if (user) {
    return res.status(400).send({ message: 'Email already exists' })
  }
  next()
}

export const usersMiddlewares = {
  validateNoSameEmail,
}
