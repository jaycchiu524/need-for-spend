import Joi from 'joi'

import { User } from './dao'

import { CreateUserDto } from './dto.types'

const nameJoi = (name: string) =>
  Joi.string()
    .alphanum()
    .min(2)
    .max(30)
    .required()
    .messages({
      'any.required': `${name} is required`,
      'string.alphanum': `${name} must be alphanumeric`,
      'string.min': `${name} must be at least 2 characters long`,
      'string.max': `${name} must be at most 30 characters long`,
    })

/**
 * @example
 {
  "firstName": "John",
  "lastName": "Doe",
  "email": "jaychiu@ex.com",
  "password": "123456"
 }
 */

export const userSchema = Joi.object<CreateUserDto>({
  firstName: nameJoi('First name'),
  lastName: nameJoi('Last name'),
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Invalid email',
  }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({ 'any.required': 'Password must be 6 characters long' }),
})

export const userInfoUpdateSchema = Joi.object<User>({
  id: Joi.string().required(), // From params.useId
  firstName: nameJoi('First name').optional(),
  lastName: nameJoi('Last name').optional(),
  password: Joi.string()
    .min(6)
    .messages({ 'string.min': 'Password must be 6 characters long' })
    .optional(),
})
  .required()
  .min(2) // id + 1 other field
  .keys({
    email: Joi.forbidden(),
    role: Joi.forbidden(),
    createdAt: Joi.forbidden(),
    updatedAt: Joi.forbidden(),
  })
  .messages({
    'object.min': 'At least 1 field is required',
  })
