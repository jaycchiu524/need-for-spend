import { prisma, type Prisma } from '@/configs/prismaClient'

export type CreateAccount = Prisma.AccountCreateManyInput

const createAccounts = async (accounts: CreateAccount[]) => {
  return await prisma.account.createMany({
    data: accounts,
  })
}

const getAccountById = async (
  id: string,
  config?: Prisma.AccountFindUniqueArgs,
) => {
  return await prisma.account.findUnique({
    ...config,
    where: {
      ...config?.where,
      id,
    },
    include: {
      item: {
        select: {
          userId: true,
        },
      },
    },
  })
}

const getAccountsByUserId = async (
  userId: string,
  config?: Prisma.AccountFindManyArgs,
) => {
  return await prisma.account.findMany({
    ...config,
    where: {
      ...config?.where,
      item: {
        userId,
      },
    },
    orderBy: config?.orderBy || {
      name: 'asc',
    },
    take: config?.take || 50,
    skip: config?.skip || 0,
  })
}

const getAccountByPlaidAccountId = async (
  plaidAccountId: string,
  config?: Prisma.AccountFindUniqueArgs,
) => {
  return await prisma.account.findUnique({
    ...config,
    where: {
      ...config?.where,
      plaidAccountId,
    },
  })
}

const getAccountsByItemId = async (
  itemId: string,
  config?: Prisma.AccountFindManyArgs,
) => {
  return await prisma.account.findMany({
    ...config,
    where: {
      ...config?.where,
      itemId,
    },
    take: config?.take || 50,
    skip: config?.skip || 0,
  })
}

export const accountsDao = {
  createAccounts,
  getAccountsByUserId,
  getAccountByPlaidAccountId,
  getAccountsByItemId,
  getAccountById,
}
