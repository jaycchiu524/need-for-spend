import { AccountBase } from 'plaid'

import { prisma, type Prisma } from '@/configs/prismaClient'

export type CreateAccount = Prisma.AccountCreateManyInput

const createAccounts = async (itemId: string, accounts: AccountBase[]) => {
  const query: CreateAccount[] = accounts.map((account) => {
    return {
      itemId,
      plaidAccountId: account.account_id,
      name: account.name,
      type: account.type,
      subtype: account.subtype,
      mask: account.mask,
      officialName: account.official_name,
      balanceAvailable: account.balances.available,
      balanceCurrent: account.balances.current,
      balanceLimit: account.balances.limit,
      balanceIsoCurrencyCode: account.balances.iso_currency_code,
      balanceUnofficialCurrencyCode: account.balances.unofficial_currency_code,
    }
  })

  return await prisma.account.createMany({
    data: { ...query },
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

export const accountsDao = {
  createAccounts,
  getAccountsByUserId,
}
