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

const createUser = async (req: CreateUserDto) => {
  const { email, password, firstName, lastName } = req

  const user = {
    data: {
      email,
      password,
      firstName,
      lastName,
      role: Role.USER,
    },
  }

  return prisma.user.create(user)
}

const createAdmin = async (req: CreateUserDto) => {
  const { email, password, firstName, lastName } = req

  const admin = {
    data: {
      email,
      password,
      firstName,
      lastName,
      role: Role.ADMIN,
    },
  }

  return prisma.user.create(admin)
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
  createUser,
  createAdmin,
  getUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  getUserByEmailWithPassword,
}
