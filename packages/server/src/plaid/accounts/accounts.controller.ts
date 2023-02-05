import { Request, Response } from 'express'

import debug from 'debug'

import { JWT } from '@/auth/dto.types'

import { transactionsServices } from '@/plaid/transactions/services'

const log = debug('app: account-controllers')

const getTransactionsByAccountId = async (
  req: Request<{ accountId: string }>,
  res: Response<any, { jwt: JWT }>,
) => {
  try {
    const accountId = req.params.accountId

    const transactions = await transactionsServices.getTransactionsByAccountId(
      accountId,
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

export const accountsControllers = {
  getTransactionsByAccountId,
}
