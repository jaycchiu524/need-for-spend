import { itemsDao, CreateItemInput } from './dao'

const createItem = async (item: CreateItemInput) => {
  return await itemsDao.createItem(item)
}

const getItemById = async (id: string) => {
  return await itemsDao.getItemById(id)
}

const getItemByPlaidItemId = async (plaidItemId: string) => {
  return await itemsDao.getItemByPlaidItemId(plaidItemId)
}

const updateItemTransactionsCursor = async (
  plaidItemId: string,
  transactionsCursor: string,
) => {
  return await itemsDao.updateItemTransactionsCursor(
    plaidItemId,
    transactionsCursor,
  )
}

export const itemsServices = {
  // Item
  createItem,
  getItemById,
  getItemByPlaidItemId,
  updateItemTransactionsCursor,
}
