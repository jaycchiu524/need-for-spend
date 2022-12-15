import type { Prisma } from '@/common/prismaClient'

export type CreateUserDto = Pick<
  Prisma.UserCreateInput,
  'email' | 'password' | 'firstName' | 'lastName'
>
