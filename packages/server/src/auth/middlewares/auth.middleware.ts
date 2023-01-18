import { NextFunction, Request, Response } from 'express'

import debug from 'debug'

import { usersServices } from '@/users/users.services'

import { LoginRequest, VerifiedRequest } from '../dto.types'

const log = debug('app:auth-middleware')

const verifyUserPassword = async (
  req: Request<any, any, LoginRequest | VerifiedRequest>,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body as LoginRequest
  const user = await usersServices.getUserByEmailWithPassword(email)
  if (user && (await usersServices.verifyPassword(password, user.password))) {
    req.body = {
      id: user.id,
      email: user.email,
      role: user.role,
    } as VerifiedRequest

    next()
  } else {
    log('user: %o', user)

    res.status(401).send({ message: 'Invalid email or password' })
  }
}

export const authMiddlewares = {
  verifyUserPassword,
}
