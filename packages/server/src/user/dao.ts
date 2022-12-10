import { nanoid } from 'nanoid'

import { prisma, type Prisma } from '@/common/prismaClient'

import { CreateUserDto } from './dto.types'
import { Role } from './role'

export type User = Prisma.UserCreateInput

const getUsers = async (args: {
  take?: number
  skip?: number
  // cursor?: Prisma.UserWhereUniqueInput
  // where?: Prisma.UserWhereInput
  // orderBy?: Prisma.UserOrderByInput
}) => {
  const { take, skip } = args
  return await prisma.user.findMany({
    take,
    skip,
  })
}

const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  })
}

const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  })
}

const createUser = async (req: CreateUserDto) => {
  const { email, password, firstName, lastName } = req

  const user = {
    data: {
      id: nanoid(),
      email,
      password,
      firstName,
      lastName,
      role: Role.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  }

  await prisma.user.create(user)

  return user.data.id
}

export const userDao = {
  getUsers,
  getUserById,
  getUserByEmail,
  createUser,
}
