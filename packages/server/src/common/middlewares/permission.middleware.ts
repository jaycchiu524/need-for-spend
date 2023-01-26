import debug from 'debug'

import { Role } from '../types/permission.enum'

import type { NextFunction, Request, Response } from 'express'

const log = debug('app: permission-middleware')

const onlySameUserOrAdminCanDoThisAction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (
    req.params &&
    req.params.userId &&
    req.params.userId === res.locals.jwt.userId
  ) {
    log('Permission granted: same user - %o', res.locals.jwt.userId)
    next()
  } else {
    const userPermissionFlags = parseInt(res.locals.jwt.permissionFlags)
    if (userPermissionFlags & Role.ADMIN) {
      log('Permission granted: Permission - %o', res.locals.permissionFlags)
      next()
    } else {
      res.status(403).send()
    }
  }
}

export const permissionMiddleware = {
  onlySameUserOrAdminCanDoThisAction,
}
