import crypto from 'crypto'

import debug from 'debug'
import { NextFunction, Request, Response } from 'express'

import jwt from 'jsonwebtoken'

import * as argon2 from 'argon2'

import { usersServices } from '@/users/users.services'

import { userRegisterSchema } from './auth.joi'

import {
  ErrorResponse,
  JWT,
  RegisterResponse,
  RegisterRequest,
  VerifiedRequest,
  LoginResponse,
} from './dto.types'

const log = debug('app:auth-controllers')

const jwtSecret: string | undefined = process.env.JWT_SECRET
const tokenExpirationTime = '1h'

const _createJWT = (body: VerifiedRequest, jwtSecret: string) => {
  const refreshId = body.id + jwtSecret
  const salt = crypto.createSecretKey(crypto.randomBytes(16))
  const hash = crypto
    .createHmac('sha512', salt)
    .update(refreshId)
    .digest('base64')

  body.refreshKey = salt.export()

  // log('req.body', Object.keys(req.body))
  /**
     * 
     * {
        id: string;
        email: string;
        role: string;
        refreshKey?: string | undefined;
      }
     */

  const token = jwt.sign(body, jwtSecret, {
    expiresIn: tokenExpirationTime,
  })

  return {
    refreshKey: salt.export(),
    refreshToken: hash,
    accessToken: token,
  }
}

/**
 * Register a user and return a JWT
 */

const register = async (
  req: Request<any, any, RegisterRequest | VerifiedRequest>,
  res: Response<RegisterResponse | ErrorResponse, any>,
  next: NextFunction,
) => {
  const validate = userRegisterSchema.validate(req.body)
  if (validate.error) {
    return res.status(400).send({
      code: 400,
      message: validate.error.details[0].message,
    })
  }

  try {
    const registerBody = req.body as RegisterRequest

    registerBody.password = await argon2.hash(registerBody.password)
    const user = await usersServices.createUser(registerBody)
    log(user)

    req.body = {
      id: user.id,
      email: user.email,
      role: user.role,
    } as VerifiedRequest

    next()
  } catch (err) {
    log('register err: %o', err)
    return res.status(500).send({
      code: 500,
      message: err as string,
    })
  }
}

/**
 * Login a user and return a JWT
 * @param req
 * @param res
 *
 *  @returns response
 * - 200 if the user is logged in
 * - 400 if the request body is invalid
 * - 401 if the user is not found or the password is incorrect
 * - 500 if there is an error
 **/

const login = async (
  req: Request<any, any, VerifiedRequest>,
  res: Response<LoginResponse | ErrorResponse, { jwt: JWT }>,
) => {
  try {
    if (!jwtSecret) {
      throw new Error('JWT secret is not defined')
    }

    const { refreshKey, refreshToken, accessToken } = _createJWT(
      req.body,
      jwtSecret,
    )

    req.body.refreshKey = refreshKey

    log('req.body', Object.keys(req.body))
    /**
     * 
     * {
        id: string;
        email: string;
        role: string;
        refreshKey?: string | undefined;
      }
     */

    const decoded = jwt.decode(accessToken, { json: true })

    if (!decoded?.exp) {
      throw new Error('JWT decode failed')
    }

    return res.status(201).send({
      id: req.body.id,
      accessToken: accessToken,
      refreshToken: refreshToken,
      exp: decoded.exp,
    })
  } catch (err) {
    log('login err: %o', err)
    return res.status(500).send({
      code: 500,
      message: err as string,
    })
  }
}

export const authControllers = {
  register,
  login,
}

/**
 * The jsonwebtoken library will sign a new token with our jwtSecret.
 * We’ll also generate a salt and a hash using the Node.js-native crypto
 * module, then use them to create a refreshToken with which API consumers
 * can refresh the current JWT—a setup that’s particularly good to have
 * in place for an app to be able to scale.
 * What’s the difference between refreshKey, refreshToken, and accessToken?
 * The *Tokens are sent to our API consumers with the idea being that the
 * accessToken is used for any request beyond what’s available to the
 * general public, and refreshToken is used to request a replacement for
 * an expired accessToken. The refreshKey, on the other hand, is used to
 * pass the salt variable—encrypted within the refreshToken—back to our
 * refresh middleware, which we’ll get to below.
 */

// There is a scalability reason, in that the access_token could be verifiable on the resource server without DB lookup or a call out to a central server, then the refresh token serves as the means for revoking in the "an access token good for an hour, with a refresh token good for a year or good-till-revoked."
// There is a security reason, the refresh_token is only ever exchanged with authorization server whereas the access_token is exchanged with resource servers.  This mitigates the risk of a long-lived access_token leaking (query param in a log file on an insecure resource server, beta or poorly coded resource server app, JS SDK client on a non https site that puts the access_token in a cookie, etc) in the "an access token good for an hour, with a refresh token good for a year or good-till-revoked" vs "an access token good-till-revoked without a refresh token."
