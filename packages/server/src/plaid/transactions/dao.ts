import { RemovedTransaction } from 'plaid'

import debug from 'debug'

import { prisma, type Prisma } from '@/configs/prismaClient'

export type CreateTransactions = Prisma.TransactionCreateManyInput

export type SpendingSumOverTime = {
  year: number
  month: number
  day: number
  sum: number
  count: number
}

const log = debug('app:transactions:dao')

const defaultConfig = {
  orderBy: [
    { date: 'desc' },
    { datetime: 'desc' },
    { name: 'asc' },
  ] as Prisma.Enumerable<Prisma.TransactionOrderByWithRelationInput>,
  take: 50,
  skip: 0,
  include: {
    category: {
      select: {
        name: true,
      },
    },
  },
}

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
      ...defaultConfig,
      ...config,
      where: {
        ...config?.where,
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

const getTransactionsByAccountId = async (
  accountId: string,
  config?: Prisma.TransactionFindManyArgs,
) => {
  try {
    return await prisma.transaction.findMany({
      ...defaultConfig,
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
        category: {
          select: {
            name: true,
            subcategories: {
              select: {
                subcategoryName: true,
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

const getTransactionsByItemId = async (
  itemId: string,
  config?: Prisma.TransactionFindManyArgs,
) => {
  try {
    return await prisma.transaction.findMany({
      ...defaultConfig,
      ...config,
      where: {
        ...config?.where,
        account: {
          itemId,
        },
      },
    })
  } catch (error) {
    log('getTransactionsByItemId: ', error)
    throw error
  }
}

const getSpendingSumByDay = async (
  accountId: string,
  config?: {
    startDate?: string
    endDate?: string
    take?: number
    skip?: number
  },
) => {
  const { startDate, endDate, take, skip } = config || {}

  try {
    // prisma will sanitize the variables when using $queryRaw, i.e. ${accountId}
    return await prisma.$queryRaw<SpendingSumOverTime[]>`
      SELECT YEAR(date) as year, MONTH(date) as month, DAY(date) as day, SUM(amount) as sum, COUNT(amount) as count
      FROM transactions
      WHERE account_id = ${accountId} 
      AND date >= ${startDate || '0000-01-01'} 
      AND date <= ${endDate || '9999-12-31'}
      AND amount >= 0
      GROUP BY year, month, day
      ORDER BY year DESC, month DESC, day DESC
      LIMIT ${take || 50}
      OFFSET ${skip || 0}
    `
  } catch (error) {
    log('getSpendingSumByDay: ', error)
    throw error
  }
}

const getSpendingSumByMonth = async (
  accountId: string,
  config?: {
    startDate?: string
    endDate?: string
    take?: number
    skip?: number
  },
) => {
  const { startDate, endDate, take, skip } = config || {}

  try {
    // prisma will sanitize the variables when using $queryRaw, i.e. ${accountId}
    return await prisma.$queryRaw<Omit<SpendingSumOverTime, 'day'>[]>`
      SELECT YEAR(date) as year, MONTH(date) as month, SUM(amount) as sum, COUNT(amount) as count
      FROM transactions
      WHERE account_id = ${accountId} 
      AND date >= ${startDate || '0000-01-01'} 
      AND date <= ${endDate || '9999-12-31'}
      AND amount >= 0
      GROUP BY year, month
      ORDER BY year DESC, month DESC
      LIMIT ${take || 50}
      OFFSET ${skip || 0}
    `
  } catch (error) {
    log('getSpendingSumByMonth: ', error)
    throw error
  }
}

export const transactionsDao = {
  syncTransactions,
  getTransactionsByUserId,
  getTransactionsByAccountId,
  getTransactionsByItemId,
  getSpendingSumByDay,
  getSpendingSumByMonth,
}
