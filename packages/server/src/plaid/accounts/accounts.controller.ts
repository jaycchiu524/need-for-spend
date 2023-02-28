import { Request, Response } from 'express'

import debug from 'debug'

import { JWT } from '@/auth/dto.types'

import {
  type GetTransactionsQuery,
  transactionsServices,
} from '@/plaid/transactions/services'

import { SumConfigs } from '../transactions/dao'

const log = debug('app: account-controllers')

const getTransactionsByAccountId = async (
  req: Request<{ accountId: string }, any, any, GetTransactionsQuery>,
  res: Response<any, { jwt: JWT }>,
) => {
  try {
    const accountId = req.params.accountId
    const query = req.query
    const transactions = await transactionsServices.getTransactionsByAccountId(
      accountId,
      query
        ? {
            take: query.take ? Number(query.take) : undefined,
            skip: query.skip ? Number(query.skip) : undefined,
            where: {
              date: {
                lte: query.endDate,
                gte: query.startDate,
              },
            },
            orderBy: [
              { date: query.sort || 'desc' },
              { datetime: query.sort || 'desc' },
              { name: 'asc' },
            ],
          }
        : {},
    )
    if (!transactions) {
      return res.status(404).send({
        code: 404,
        message: 'Transactions not found',
      })
    }

    const userId = res.locals.jwt.id

    if (transactions[0].account.item.userId !== userId) {
      return res.status(403).send({
        code: 403,
        message: 'Forbidden',
      })
    }

    return res.status(200).send(transactions)
  } catch (err) {
    log('Error: Internal get transactions by account id: %o', err)

    return res.status(500).send({
      code: 500,
      message: 'Internal Server Error',
    })
  }
}

const getMonthlyExpenseByAccoundId = async (
  req: Request<{ accountId: string }, any, any, SumConfigs>,
  res: Response<any, { jwt: JWT }>,
) => {
  try {
    const accountId = req.params.accountId
    const query = req.query
    const monthlyExpense = await transactionsServices.getMonthlyExpense(
      accountId,
      query,
    )

    log('monthlyExpense: %o', monthlyExpense)

    return res.status(200).send(monthlyExpense)
  } catch (err) {
    log('Error: Internal get monthly spending sum by account id: %o', err)

    return res.status(500).send({
      code: 500,
      message: 'Internal Server Error',
    })
  }
}

const getDailyExpenseByAccoundId = async (
  req: Request<{ accountId: string }, any, any, SumConfigs>,
  res: Response<any, { jwt: JWT }>,
) => {
  try {
    const accountId = req.params.accountId
    const query = req.query
    const dailyExpense = await transactionsServices.getDailyExpense(
      accountId,
      query,
    )

    return res.status(200).send(dailyExpense)
  } catch (err) {
    log('Error: Internal get daily spending sum by account id: %o', err)

    return res.status(500).send({
      code: 500,
      message: 'Internal Server Error',
    })
  }
}

export const accountsControllers = {
  getTransactionsByAccountId,
  getMonthlyExpenseByAccoundId,
  getDailyExpenseByAccoundId,
}
