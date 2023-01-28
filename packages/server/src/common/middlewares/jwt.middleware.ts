import * as crypto from 'crypto'

import debug from 'debug'

import jwt, { VerifyErrors } from 'jsonwebtoken'

import { JWT, VerifiedRequest } from '@/auth/dto.types'

import type { NextFunction, Request, Response } from 'express'

const log = debug('app: jwt-middleware')

const jwtSecret: string | undefined = process.env.JWT_SECRET

const verifyRefreshBodyField = (
  req: Request<any, any, VerifiedRequest>,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.headers['authorization']) {
      log('Authorization header is not defined')
      return res.status(401).send({
        code: 401,
        message: 'Authorization header is not defined',
      })
    }

    const [bearer, token] = req.headers['authorization'].split(' ')

    if (bearer !== 'Bearer') {
      return res.status(401).send({
        code: 401,
        message: 'Invalid authorization header',
      })
    }
    if (!jwtSecret) {
      log('JWT secret is not defined')
      return res.status(500).send({
        code: 500,
        message: 'JWT secret is not defined',
      })
    }

    if (!req.body || !req.body.refreshToken) {
      log('RefreshToken field is required')
      return res
        .status(400)
        .send({ code: 400, message: 'RefreshToken field is required' })
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err && err.name !== 'TokenExpiredError') {
        log(err)
        return res.status(401).send({
          code: 401,
          message: 'Token verification failed',
        })
      }

      // Save the JWT in the response object when the token is not expired
      res.locals.jwt = decoded as JWT
    })

    if (!res.locals.jwt) {
      // If the token is expired, verify the refresh token
      res.locals.jwt = jwt.decode(token)
    }

    return next()
  } catch (err) {
    log(err)

    return res.status(500).send({
      code: 500,
      message: 'Internal: Token verification failed',
    })
  }
}

const validJWTNeeded = (
  req: Request,
  res: Response<any, { jwt: JWT }>,
  next: NextFunction,
) => {
  if (!req.headers['authorization']) {
    log('Authorization header is not defined')
    return res.status(401).send({
      code: 401,
      message: 'Authorization header is not defined',
    })
  }

  try {
    const [bearer, token] = req.headers['authorization'].split(' ')
    if (bearer !== 'Bearer') {
      return res.status(401).send({
        code: 401,
        message: 'Invalid authorization header',
      })
    }
    if (!jwtSecret) {
      log('JWT secret is not defined')
      return res.status(500).send({
        code: 500,
        message: 'JWT secret is not defined',
      })
    }

    // Save the JWT in the response object
    res.locals.jwt = jwt.verify(token, jwtSecret) as JWT
    return next()
  } catch (err) {
    const error = err as VerifyErrors

    log('JWT error: %o', err)
    // error = VerifyErrors.TokenExpiredError
    return res.status(401).send({
      code: 401,
      message: 'Invalid token',
    })
  }
}

const validRefreshNeeded = (
  req: Request<any, any, VerifiedRequest>,
  res: Response<any, { jwt: JWT }>,
  next: NextFunction,
) => {
  try {
    // JWT object is saved in the response object
    const { jwt } = res.locals
    const salt = crypto.createSecretKey(Buffer.from(jwt.refreshKey))

    const hash = crypto
      .createHmac('sha512', salt)
      .update(jwt.id + jwtSecret)
      .digest('base64')

    // refreshToken must exist thorugh verifyRefreshBodyField
    const { refreshToken } = req.body

    if (hash !== refreshToken) {
      log('Invalid refreshToken: %o', refreshToken)

      return res.status(400).send({ code: 400, message: 'Invalid request' })
    }
    return next()
  } catch (err) {
    log('validRefreshNeeded err: %o', err)
    return res.status(500).send({
      code: 500,
      message: 'Something went wrong',
    })
  }
}

export const jwtMiddlewares = {
  validJWTNeeded,
  verifyRefreshBodyField,
  validRefreshNeeded,
}
