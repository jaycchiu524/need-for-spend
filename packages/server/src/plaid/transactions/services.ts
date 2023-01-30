import debug from 'debug'

import { RemovedTransaction, Transaction } from 'plaid'

import { accountsServices } from '../accounts/services'
import { itemsServices } from '../items/services'

import { plaid } from '../plaid'

import { transactionsDao } from './dao'

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

    // Update the DB.
    const { createTransactions, updateTransactions, deleteTransactions } =
      transactionsDao

    await accountsServices.createAccounts(plaidItemId)
    if (added.length > 0) await createTransactions(added)
    if (modified.length > 0) await updateTransactions(modified)
    if (removed.length > 0) await deleteTransactions(removed)

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

export const transactionsServices = {
  updateTransactions,
}
