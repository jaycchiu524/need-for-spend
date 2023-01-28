import { itemDao, CreateItemInput } from './items/dao'

const createItem = async (item: CreateItemInput) => {
  return await itemDao.createItem(item)
}

const getItemById = async (id: string) => {
  return await itemDao.getItemById(id)
}

export const PlaidServices = {
  // Item
  createItem,
  getItemById,
}
