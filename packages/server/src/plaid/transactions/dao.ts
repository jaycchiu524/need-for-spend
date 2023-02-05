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
    log('createTransactions: ', error)
    throw error
  }
}

const updateTransactions = async (transactions: CreateTransactions[]) => {
  try {
    return await prisma.transaction.updateMany({
      data: transactions,
    })
  } catch (error) {
    log('updateTransactions: ', error)
    throw error
  }
}

const deleteTransactions = async (transactions: RemovedTransaction[]) => {
  const query = transactions.map((transaction) => {
    const { transaction_id } = transaction

    return {
      plaidTransactionId: transaction_id,
    }
  })

  try {
    return await prisma.transaction.deleteMany({
      where: {
        OR: query,
      },
    })
  } catch (error) {
    log('deleteTransactions: ', error)
    throw error
  }
}

const getTransactionsByUserId = async (userId: string) => {
  try {
    return await prisma.transaction.findMany({
      where: {
        account: {
          item: {
            userId,
          },
        },
      },
    })
  } catch (error) {
    log('getTransactionsByUserId: ', error)
    throw error
  }
}

const getTransactionsByAccountId = async (accountId: string) => {
  try {
    return await prisma.transaction.findMany({
      where: {
        accountId,
      },
      include: {
        account: {
          select: {
            item: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    })
  } catch (error) {
    log('getTransactionsByAccountId: ', error)
    throw error
  }
}

export const transactionsDao = {
  createTransactions,
  updateTransactions,
  deleteTransactions,
  getTransactionsByUserId,
  getTransactionsByAccountId,
}
