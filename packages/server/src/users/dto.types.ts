import type { Prisma } from '@/configs/prismaClient'

export type CreateUserDto = Pick<
  Prisma.UserCreateInput,
  'email' | 'password' | 'firstName' | 'lastName'
>
