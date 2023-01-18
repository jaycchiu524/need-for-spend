import Joi from 'joi'

export const userLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Invalid email',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
})
