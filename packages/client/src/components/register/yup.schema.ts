import * as yup from 'yup'

import { RegisterInput } from './types'

type SchemaShape<T extends object> = Partial<Record<keyof T, yup.AnySchema>>

export const RegisterSchema = yup.object().shape<SchemaShape<RegisterInput>>({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  cpassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
})
