import debug from 'debug'

import { RemovedTransaction, Transaction } from 'plaid'

import { Prisma } from '@/configs/prismaClient'

import { accountsServices } from '../accounts/services'
import { itemsServices } from '../items/services'

import { plaid } from '../plaid'

import { CreateTransactions, transactionsDao } from './dao'

export type GetTransactionsQuery = {
  take?: string
  skip?: string
  startDate?: string
  endDate?: string
  sort?: 'asc' | 'desc'
}

const log = debug('app: transactions-services')

/**
 * Fetches transactions from the Plaid API for a given item.
 *
 * @param {string} plaidItemId the Plaid ID for the item.
 * @returns {Object{}} an object containing transactions and a cursor.
 */
const fetchTransactionUpdates = async (plaidItemId: string) => {
  log(`Fetching transactions for item ${plaidItemId}...`)

  // the transactions endpoint is paginated, so we may need to hit it multiple times to
  // retrieve all available transactions.

  // get the access token based on the plaid item id
  const item = await itemsServices.getItemByPlaidItemId(plaidItemId)

  if (!item) {
    log(`Item ${plaidItemId} not found`)
    throw new Error('Item not found')
  }

  const accessToken = item.plaidAccessToken
  const lastCursor = item.transactionsCursor

  let cursor = lastCursor

  // New transaction updates since "cursor"
  let added: Transaction[] = []
  let modified: Transaction[] = []
  // Removed transaction ids
  let removed: RemovedTransaction[] = []
  let hasMore = true

  const batchSize = 100
  // Iterate through each page of new transaction updates for item
  /* eslint-disable no-await-in-loop */
  try {
    while (hasMore) {
      const request = {
        access_token: accessToken,
        cursor: cursor || '',
        count: batchSize,
      }
      const response = await plaid.transactionsSync(request)
      const data = response.data
      // Add this page of results
      added = added.concat(data.added)
      modified = modified.concat(data.modified)
      removed = removed.concat(data.removed)
      hasMore = data.has_more
      // Update cursor to the next cursor
      cursor = data.next_cursor
    }
  } catch (err) {
    log(`Error fetching transactions: ${err}`)
    cursor = lastCursor
    throw err
  }
  return { added, modified, removed, cursor, accessToken }
}

const convertTransactions = async (transaction: Transaction) => {
  const {
    account_id,
    transaction_id,
    amount,
    iso_currency_code,
    unofficial_currency_code,
    date,
    datetime,
    name,
    location,
    category_id,
    account_owner,
    pending,
  } = transaction

  // TODO: Optimize this to use a single query
  const account = await accountsServices.getAccountByPlaidAccountId(account_id)

  if (!account) throw new Error('Account not found')
  const accountId = account.id

  const createQuery: CreateTransactions = {
    accountId: accountId,
    plaidTransactionId: transaction_id,
    amount: amount,
    isoCurrencyCode: iso_currency_code,
    unofficialCurrencyCode: unofficial_currency_code,
    date: date,
    datetime: datetime,
    name: name,
    address: location?.address,
    plaidCategoryId: category_id,
    accountOwner: account_owner,
    pending: pending,
  }

  return createQuery
}

/**
 * Handles the fetching and storing of new, modified, or removed transactions
 *
 * @param {string} plaidItemId the Plaid ID for the item.
 */
const updateTransactions = async (plaidItemId: string) => {
  log(`Updating transactions for item ${plaidItemId}...`)

  try {
    // Fetch new transactions from plaid api.
    const {
      added,
      modified,
      removed,
      cursor,
      // accessToken
    } = await fetchTransactionUpdates(plaidItemId)

    // Update the accounts
    await accountsServices.createAccounts(plaidItemId)

    // Update the transactions.
    const { syncTransactions } = transactionsDao

    // added transactions
    const _add = added.map(convertTransactions)
    const _modified = modified.map(convertTransactions)

    const create = await Promise.all(_add)
    const update = await Promise.all(_modified)

    // Add new transactions and update modified transactions.
    await syncTransactions(create, update, removed)

    if (cursor) {
      await itemsServices.updateItemTransactionsCursor(plaidItemId, cursor)
    }

    return {
      addedCount: added.length,
      modifiedCount: modified.length,
      removedCount: removed.length,
    }
  } catch (err) {
    log(`Error updating transactions: ${err}`)
    throw err
  }
}

const getTransactionsByUserId = async (
  userId: string,
  configs?: Prisma.TransactionFindManyArgs,
) => {
  log(`Getting transactions for user ${userId}...`)
  try {
    const transactions = await transactionsDao.getTransactionsByUserId(
      userId,
      configs,
    )
    return transactions
  } catch (err) {
    log(`Error getting transactions: ${err}`)
    throw err
  }
}

const getTransactionsByAccountId = async (
  accountId: string,
  configs?: Prisma.TransactionFindManyArgs,
) => {
  log(`Getting transactions for account ${accountId}...`)
  try {
    const transactions = await transactionsDao.getTransactionsByAccountId(
      accountId,
      configs,
    )
    return transactions
  } catch (err) {
    log(`Error getting transactions: ${err}`)
    throw err
  }
}

export const transactionsServices = {
  updateTransactions,
  getTransactionsByUserId,
  getTransactionsByAccountId,
}
