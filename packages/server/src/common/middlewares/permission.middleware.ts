import debug from 'debug'

import { JWT } from '@/auth/dto.types'

import { Role } from '../types/permission.enum'

import type { NextFunction, Request, Response } from 'express'

const log = debug('app: permission-middleware')

/**
 * Role required for this action
 * @param role Role - 1 | 2 | 4 | 2147483647
 * @returns 403 if not match, 500 if error
 * @info Use after jwtMiddleware
 * @route GET /users
 */
const roleRequired = (role: Role) => {
  return (
    req: Request,
    res: Response<any, { jwt: JWT }>,
    next: NextFunction,
  ) => {
    try {
      const userPermissionFlags = res.locals.jwt.role
      // @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
      if (userPermissionFlags & role) {
        next()
      } else {
        log(
          'Permission denied: %o - %o',
          res.locals.jwt.id,
          res.locals.jwt.role,
        )

        res.status(403).send({
          code: 403,
          message: 'Permission denied',
        })
      }
    } catch (err) {
      log(err)
      res.status(500).send({
        code: 500,
        message: 'Internal server error',
      })
    }
  }
}

/**
 * Only same user or admin can do this action
 * @return 403 if not match
 * @info Use after jwtMiddleware
 * @route GET /users/:userId
 */
const onlySameUserOrAdmin = (
  req: Request,
  res: Response<any, { jwt: JWT }>,
  next: NextFunction,
) => {
  if (
    req.params &&
    req.params.userId &&
    req.params.userId === res.locals.jwt.id
  ) {
    log('Permission granted: same user - %o', res.locals.jwt.id)
    next()
  } else {
    const userPermissionFlags = res.locals.jwt.role
    if (userPermissionFlags & Role.ADMIN) {
      next()
    } else {
      res.status(403).send({
        code: 403,
        message: 'Permission denied',
      })
    }
  }
}

export const permissionMiddlewares = {
  onlySameUserOrAdmin,
  roleRequired,
}
