import debug from 'debug'

import { prisma, type Prisma } from '@/configs/prismaClient'

const log = debug('app:categories-dao')

const createCategories = async (categories: Prisma.CategoryCreateInput[]) => {
  log('Creating categories: %o records', categories.length)

  const res = await prisma.$transaction(
    categories.map((category) =>
      prisma.category.upsert({
        where: {
          plaidCategoryId: category.plaidCategoryId,
        },
        create: category,
        update: category,
      }),
    ),
  )

  return res
}

export const categoriesDao = {
  createCategories,
}
