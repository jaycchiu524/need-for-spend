import type { Prisma } from '@/configs/prismaClient'

export type RegisterRequest = Pick<
  Prisma.UserCreateInput,
  'email' | 'password' | 'firstName' | 'lastName'
>

export type LoginRequest = Pick<Prisma.UserCreateInput, 'email' | 'password'>

export type VerifiedRequest = {
  id: string
  email: string
  role: number
  refreshKey?: Buffer
  refreshToken?: string
}

export type JWT = VerifiedRequest & {
  refreshKey: Buffer
}

export type RegisterResponse = {
  id: string
  accessToken: string
  refreshToken: string
  exp: number
}
export type LoginResponse = RegisterResponse

export type ErrorResponse = {
  code: number
  message: string
}
