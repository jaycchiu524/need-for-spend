import { itemsDao, CreateItemInput } from './dao'

const createItem = async (item: CreateItemInput) => {
  return await itemsDao.createItem(item)
}

const getItemById = async (id: string) => {
  return await itemsDao.getItemById(id)
}

// The only service returns the item with the access token
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

const getItemsByUserId = async (userId: string) => {
  return await itemsDao.getItemsByUserId(userId)
}

const deleteItemById = async (id: string) => {
  await itemsDao.deleteItemById(id)
}

export const itemsServices = {
  createItem,
  getItemById,
  getItemByPlaidItemId,
  updateItemTransactionsCursor,
  getItemsByUserId,
  deleteItemById,
}
