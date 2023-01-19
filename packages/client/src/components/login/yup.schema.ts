import * as yup from 'yup'

import { LoginInput } from './types'

type SchemaShape<T extends object> = Partial<Record<keyof T, yup.AnySchema>>

export const LoginSchema = yup.object().shape<SchemaShape<LoginInput>>({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required(),
})
