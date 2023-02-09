import debug from 'debug'

import { prisma, type Prisma } from '../src/configs/prismaClient'
import { plaid } from '../src/plaid/plaid'

// Database seeding happens in two ways with Prisma:
// 1. manually with prisma db seed
// 2. automatically in prisma migrate dev and prisma migrate reset.

const log = debug('prisma-seeding')

const populateCategories = async () => {
  log('Fetching categories from plaid api...')

  try {
    const {
      data: { categories: _categories },
    } = await plaid.categoriesGet({})

    log('Successfully fetched categories from plaid api...')

    const categories: Prisma.CategoryCreateInput[] = _categories.map(
      (category) => {
        const { category_id, group, hierarchy } = category

        const [mainCategory, ..._subcategories] = hierarchy

        const subcategories: Prisma.CategoriesOnSubcategoriesCreateNestedManyWithoutCategoryInput['connectOrCreate'] =
          _subcategories.map((subcategory, i) => {
            const where: Prisma.CategoriesOnSubcategoriesCreateOrConnectWithoutCategoryInput['where'] =
              {
                plaidCategoryId_subcategoryName: {
                  plaidCategoryId: category_id,
                  subcategoryName: subcategory,
                },
              }

            const create: Prisma.CategoriesOnSubcategoriesCreateOrConnectWithoutCategoryInput['create'] =
              {
                subcategory: {
                  connectOrCreate: {
                    where: {
                      name: subcategory,
                    },
                    create: {
                      name: subcategory,
                      depth: i,
                    },
                  },
                },
              }

            const subcategoryInput: Prisma.CategoriesOnSubcategoriesCreateNestedManyWithoutCategoryInput['connectOrCreate'] =
              {
                where: where,
                create: create,
              }

            return subcategoryInput
          })

        return {
          plaidCategoryId: category_id,
          name: mainCategory,
          group,
          subcategories: {
            connectOrCreate: subcategories,
          },
        }
      },
    )

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

    log('Successfully populated categories... - %o records', res.length)
  } catch (error) {
    log('Error occurs: ', error)
    throw error
  }
}

populateCategories()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
