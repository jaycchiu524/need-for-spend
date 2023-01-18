import { Request, Response, NextFunction } from 'express'

import { usersServices } from './users.services'

const extractUserId = (req: Request, res: Response, next: NextFunction) => {
  req.body.id = req.params.userId
  next()
}

const validateNoSameEmail = async (
  req: Request<any, any, { email: string }>,
  res: Response,
  next: NextFunction,
) => {
  const { email } = req.body
  const user = await usersServices.getUserByEmail(email)
  if (user) {
    return res.status(400).send({
      code: 400,
      message: 'Email already exists',
    })
  }
  next()
}

const validateUserExists = async (
  req: Request<{ userId: string }>,
  res: Response,
  next: NextFunction,
) => {
  const user = await usersServices.getUserById(req.params.userId)
  if (user) {
    // For checking if the user has the permission to do something
    res.locals.user = user
    next()
  } else {
    res.status(404).send({ error: `User ${req.params.userId} not found` })
  }
}

export const usersMiddlewares = {
  extractUserId,
  validateNoSameEmail,
  validateUserExists,
}
