import debug from 'debug'

import { type Prisma } from '@/configs/prismaClient'
import { plaid } from '@/plaid/plaid'

import { categoriesDao } from './dao'

const log = debug('app:categories-services')

const syncPlaidCategories = async () => {
  log('Fetching categories from plaid api...')

  // DEBUG: Uncomment this line to see the categories from plaid api
  console.log('🌱 Fetching categories from plaid api...')

  try {
    const {
      data: { categories: _categoriesPlaid },
    } = await plaid.categoriesGet({})

    log('Successfully fetched categories from plaid api...')
    // DEBUG: Uncomment this line to see the categories from plaid api
    console.log('🌱 Successfully fetched categories from plaid api...')

    const categories = _categoriesPlaid.map((category) => {
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
    })

    return await categoriesDao.createCategories(categories)
  } catch (error) {
    log('Error occurs: ', error)

    // DEBUG: Uncomment this line to see the categories from plaid api
    console.log('🌱 Error occurs: ', error)
    throw error
  }
}

export const categoriesServices = {
  syncPlaidCategories,
}
