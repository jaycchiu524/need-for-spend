import { itemsServices } from '../items/services'
import { plaid } from '../plaid'

import { accountsDao, CreateAccount } from './dao'

const createAccounts = async (plaidItemId: string) => {
  try {
    const item = await itemsServices.getItemByPlaidItemId(plaidItemId)

    if (!item) {
      throw new Error('Item not found')
    }

    const { data } = await plaid.accountsGet({
      access_token: item.plaidAccessToken,
      client_id: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
    })

    const query: CreateAccount[] = data.accounts.map((account) => {
      return {
        itemId: item.id,
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
        balanceUnofficialCurrencyCode:
          account.balances.unofficial_currency_code,
      }
    })

    const accounts = await accountsDao.createAccounts(query)

    return accounts
  } catch (err) {
    throw err
  }
}

const getAccountById = async (id: string) => {
  try {
    return await accountsDao.getAccountById(id)
  } catch (err) {
    throw err
  }
}

const getAccountsByUserId = async (userId: string) => {
  try {
    return await accountsDao.getAccountsByUserId(userId)
  } catch (err) {
    throw err
  }
}

const getAccountByPlaidAccountId = async (plaidAccountId: string) => {
  try {
    return await accountsDao.getAccountByPlaidAccountId(plaidAccountId)
  } catch (err) {
    throw err
  }
}

const getAccountsByItemId = async (itemId: string) => {
  try {
    return await accountsDao.getAccountsByItemId(itemId)
  } catch (err) {
    throw err
  }
}

export const accountsServices = {
  createAccounts,
  getAccountsByUserId,
  getAccountByPlaidAccountId,
  getAccountsByItemId,
  getAccountById,
}
