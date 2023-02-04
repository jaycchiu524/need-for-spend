import { prisma, type Prisma } from '@/configs/prismaClient'

export type CreateAccount = Prisma.AccountCreateManyInput

const createAccounts = async (accounts: CreateAccount[]) => {
  return await prisma.account.createMany({
    data: accounts,
  })
}

const getAccountsByUserId = async (userId: string) => {
  return await prisma.account.findMany({
    where: {
      item: {
        userId,
      },
    },
  })
}

const getAccountByPlaidAccountId = async (plaidAccountId: string) => {
  return await prisma.account.findUnique({
    where: {
      plaidAccountId,
    },
  })
}

export const accountsDao = {
  createAccounts,
  getAccountsByUserId,
  getAccountByPlaidAccountId,
}
