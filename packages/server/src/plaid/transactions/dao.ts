import { RemovedTransaction } from 'plaid'

import debug from 'debug'

import { prisma, type Prisma } from '@/configs/prismaClient'

export type CreateTransactions = Prisma.TransactionCreateManyInput

const log = debug('app:transactions:dao')

const createTransactions = async (transactions: CreateTransactions[]) => {
  try {
    return await prisma.transaction.createMany({
      data: transactions,
    })
  } catch (error) {
    throw error
  }
}

const updateTransactions = async (transactions: CreateTransactions[]) => {
  return await prisma.transaction.updateMany({
    data: transactions,
  })
}

const deleteTransactions = async (transactions: RemovedTransaction[]) => {
  const query = transactions.map((transaction) => {
    const { transaction_id } = transaction

    return {
      plaidTransactionId: transaction_id,
    }
  })

  return await prisma.transaction.deleteMany({
    where: {
      OR: query,
    },
  })
}

const getTransactionsByUserId = async (userId: string) => {
  return await prisma.transaction.findMany({
    where: {
      account: {
        item: {
          userId,
        },
      },
    },
  })
}

export const transactionsDao = {
  createTransactions,
  updateTransactions,
  deleteTransactions,
  getTransactionsByUserId,
}
