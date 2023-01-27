import { Request, Response, NextFunction } from 'express'

import { usersServices } from './users.services'

/**
 * Append the userId to the body
 * @info This middleware is used to extract the userId from the params and append it to the body
 */
const extractUserId = (req: Request, res: Response, next: NextFunction) => {
  req.body.id = req.params.userId
  next()
}

/**
 * Validate that the email does not exist
 * @returns 400 if the email already exists
 * @info For creating a new user
 * @route /users
 */
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

/**
 * Validate that the user exists
 * @returns 404 if the user does not exist
 * @info For retrieving and updating a specific user
 * @route /users/:userId
 */
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
    res.status(404).send({ message: `User ${req.params.userId} not found` })
  }
}

export const usersMiddlewares = {
  extractUserId,
  validateNoSameEmail,
  validateUserExists,
}
