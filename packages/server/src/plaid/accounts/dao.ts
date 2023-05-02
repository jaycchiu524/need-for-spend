import { prisma, type Prisma } from '@/configs/prismaClient'

const createAccounts = async (accounts: Prisma.AccountCreateManyInput[]) => {
  return await prisma.account.createMany({
    data: accounts,
  })
}

const updateAccount = async (account: Prisma.AccountUpdateInput) => {
  return await prisma.account.update({
    where: {
      plaidAccountId: account.plaidAccountId as string,
    },
    data: account,
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
  updateAccount,
  getAccountsByUserId,
  getAccountByPlaidAccountId,
  getAccountsByItemId,
  getAccountById,
}
