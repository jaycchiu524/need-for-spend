import { itemsServices } from '../items/services'
import { plaid } from '../plaid'

import { accountsDao } from './dao'

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

    const accounts = await accountsDao.createAccounts(item.id, data.accounts)

    return accounts
  } catch (err) {
    throw err
  }
}

export const accountsServices = {
  createAccounts,
}
