import { prisma } from '@/common/prismaClient'

import { CreateUserInput } from './interfaces'

const createUser = async (req: CreateUserInput) => {
  const { email, password } = req

  await prisma.user.create({
    data: {
      email,
      password,
    },
  })
}

const getUsers = async () => {
  return await prisma.user.findMany({})
}

export const userServices = {
  createUser,
  getUsers,
}
