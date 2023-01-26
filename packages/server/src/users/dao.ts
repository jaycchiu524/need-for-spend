import { nanoid } from 'nanoid'

import { prisma, type Prisma } from '@/configs/prismaClient'

import { Role } from '@/common/types/permission.enum'

import { CreateUserDto } from './dto.types'

export type User = Prisma.UserCreateInput
export type UserInfo = Pick<User, 'firstName' | 'lastName' | 'password'>

const userSelect: Prisma.UserSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  createdAt: true,
  updatedAt: true,
}

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
    select: userSelect,
  })
}

const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    select: userSelect,
  })
}

const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
    select: userSelect,
  })
}

const getUserByEmailWithPassword = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      ...userSelect,
      password: true,
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

  return user.data
}

const updateUser = async (id: string, data: Partial<User>) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  })
}

export const userDao = {
  getUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  getUserByEmailWithPassword,
}
