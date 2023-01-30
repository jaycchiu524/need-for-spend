import { prisma, type Prisma } from '@/configs/prismaClient'

export type CreateItemInput = Prisma.ItemCreateInput

const getItemByPlaidItemId = async (plaidItemId: string) => {
  return await prisma.item.findUnique({
    where: {
      plaidItemId,
    },
  })
}

const selectNoAccessToken: Prisma.ItemSelect = {
  id: true,
  plaidAccessToken: false,
  plaidItemId: true,
  plaidInstitutionId: true,
  plaidInstitutionName: true,
  transactionsCursor: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
}

const getItemsByUserId = async (userId: string) => {
  return await prisma.item.findMany({
    where: {
      userId,
    },
    select: selectNoAccessToken,
  })
}

const createItem = async (item: CreateItemInput) => {
  return await prisma.item.create({
    data: item,
    select: selectNoAccessToken,
  })
}

const getItemById = async (id: string) => {
  return await prisma.item.findUnique({
    where: {
      id,
    },
    select: selectNoAccessToken,
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
    select: selectNoAccessToken,
  })
}

export const itemsDao = {
  getItemsByUserId,
  createItem,
  getItemById,
  getItemByPlaidItemId,
  updateItemTransactionsCursor,
}
