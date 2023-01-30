import { RemovedTransaction, Transaction } from 'plaid'

import { prisma, type Prisma } from '@/configs/prismaClient'

export type CreateTransactions = Prisma.TransactionCreateManyInput

const createTransactions = async (transactions: Transaction[]) => {
  const query: CreateTransactions[] = transactions.map((transaction) => {
    const {
      account_id,
      transaction_id,
      amount,
      iso_currency_code,
      unofficial_currency_code,
      date,
      name,
      location,
      category_id,
      account_owner,
      pending,
    } = transaction

    const createQuery: CreateTransactions = {
      accountId: account_id,
      plaidTransactionId: transaction_id,
      amount: amount,
      isoCurrencyCode: iso_currency_code,
      unofficialCurrencyCode: unofficial_currency_code,
      date: date,
      name: name,
      address: location?.address,
      categoryId: category_id,
      accountOwner: account_owner,
      pending: pending,
    }

    return createQuery
  })

  return await prisma.transaction.createMany({
    data: query,
  })
}

const updateTransactions = async (transactions: Transaction[]) => {
  const query: CreateTransactions[] = transactions.map((transaction) => {
    const {
      account_id,
      transaction_id,
      amount,
      iso_currency_code,
      unofficial_currency_code,
      date,
      name,
      location,
      category_id,
      account_owner,
      pending,
    } = transaction

    const update: CreateTransactions = {
      accountId: account_id,
      plaidTransactionId: transaction_id,
      amount: amount,
      isoCurrencyCode: iso_currency_code,
      unofficialCurrencyCode: unofficial_currency_code,
      date: date,
      name: name,
      address: location?.address,
      categoryId: category_id,
      accountOwner: account_owner,
      pending: pending,
    }

    return update
  })

  return await prisma.transaction.updateMany({
    data: query,
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
