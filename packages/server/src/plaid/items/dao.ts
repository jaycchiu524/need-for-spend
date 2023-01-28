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

export const itemDao = {
  createItem,
  getItemById,
}
