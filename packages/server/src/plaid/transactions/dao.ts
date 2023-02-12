import { RemovedTransaction } from 'plaid'

import debug from 'debug'

import { prisma, type Prisma } from '@/configs/prismaClient'

export type CreateTransactions = Prisma.TransactionCreateManyInput

const log = debug('app:transactions:dao')

const defaultConfig = (config?: Prisma.TransactionFindManyArgs) => ({
  orderBy: config?.orderBy || [
    { date: 'desc' },
    { datetime: 'desc' },
    { name: 'asc' },
  ],
  take: config?.take || 50,
  skip: config?.skip || 0,
})

const _createTransactions = (transactions: CreateTransactions[]) =>
  prisma.transaction.createMany({
    data: transactions,
  })

const _updateTransactions = (transactions: CreateTransactions[]) =>
  transactions.map((transaction) =>
    prisma.transaction.update({
      data: transaction,
      where: {
        plaidTransactionId: transaction.plaidTransactionId,
      },
    }),
  )

const _deleteTransactions = (transactions: RemovedTransaction[]) => {
  const query = transactions.map((transaction) => {
    const { transaction_id } = transaction

    return {
      plaidTransactionId: transaction_id,
    }
  })

  return prisma.transaction.deleteMany({
    where: {
      OR: query,
    },
  })
}

const syncTransactions = async (
  create: CreateTransactions[],
  update: CreateTransactions[],
  remove: RemovedTransaction[],
) => {
  try {
    const transactions = []
    if (!!create.length) transactions.push(_createTransactions(create))
    if (!!update.length) transactions.push(..._updateTransactions(update))
    if (!!remove.length) transactions.push(_deleteTransactions(remove))

    return await prisma.$transaction(transactions)
  } catch (error) {
    log('syncTransactions: ', error)
    throw error
  }
}

const getTransactionsByUserId = async (
  userId: string,
  config?: Prisma.TransactionFindManyArgs,
) => {
  try {
    return await prisma.transaction.findMany({
      ...config,
      where: {
        ...config?.where,
        account: {
          item: {
            userId,
          },
        },
      },
      ...defaultConfig(config),
    })
  } catch (error) {
    log('getTransactionsByUserId: ', error)
    throw error
  }
}

const getTransactionsByAccountId = async (
  accountId: string,
  config?: Prisma.TransactionFindManyArgs,
) => {
  try {
    return await prisma.transaction.findMany({
      ...config,
      where: {
        ...config?.where,
        accountId,
      },
      include: {
        ...config?.include,
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
      ...defaultConfig(config),
    })
  } catch (error) {
    log('getTransactionsByAccountId: ', error)
    throw error
  }
}

const getTransactionsByItemId = async (
  itemId: string,
  config?: Prisma.TransactionFindManyArgs,
) => {
  try {
    return await prisma.transaction.findMany({
      ...config,
      where: {
        ...config?.where,
        account: {
          itemId,
        },
      },
      ...defaultConfig(config),
    })
  } catch (error) {
    log('getTransactionsByItemId: ', error)
    throw error
  }
}

export const transactionsDao = {
  syncTransactions,
  getTransactionsByUserId,
  getTransactionsByAccountId,
  getTransactionsByItemId,
}
