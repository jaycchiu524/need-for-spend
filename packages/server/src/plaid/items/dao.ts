import { prisma, type Prisma } from '@/configs/prismaClient'

export type CreateItemInput = Prisma.ItemCreateInput

const createItem = async (item: CreateItemInput) => {
  return await prisma.item.create({
    data: item,
  })
}

const getItemById = async (id: string) => {
  return await prisma.item.findUnique({
    where: {
      id,
    },
  })
}

const getItemByPlaidItemId = async (plaidItemId: string) => {
  return await prisma.item.findUnique({
    where: {
      plaidItemId,
    },
  })
}

const updateItemTransactionsCursor = async (
  plaidItemId: string,
  transactionsCursor: string,
) => {
  return await prisma.item.update({
    where: {
      plaidItemId,
    },
    data: {
      transactionsCursor,
    },
  })
}

export const itemsDao = {
  createItem,
  getItemById,
  getItemByPlaidItemId,
  updateItemTransactionsCursor,
}
