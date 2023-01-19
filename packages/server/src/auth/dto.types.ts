import type { Prisma } from '@/common/prismaClient'

export type RegisterRequest = Pick<
  Prisma.UserCreateInput,
  'email' | 'password' | 'firstName' | 'lastName'
>

export type LoginRequest = Pick<Prisma.UserCreateInput, 'email' | 'password'>

export type VerifiedRequest = {
  id: string
  email: string
  role: string
  refreshKey?: Buffer
  refreshToken?: string
}

export type JWT = VerifiedRequest & {
  refreshKey: Buffer
}

export type JWTResponse = {
  userId: string
  accessToken: string
  refreshToken: string
  expiresIn: string
}

export type ErrorResponse = {
  code: number
  message: string
}
