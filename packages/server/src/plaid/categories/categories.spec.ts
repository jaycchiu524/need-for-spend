import supertest from 'supertest'

import { prisma, type Prisma } from '@/configs/prismaClient'

import app from '@/app'

import { plaid } from '../plaid'

const testId1 = '123'
const testId2 = '456'
const testId3 = '789'

const testCategories = [
  {
    category_id: testId1,
    group: 'place',
    hierarchy: ['Community', 'Assisted Living Services'],
  },
  {
    category_id: testId2,
    group: 'place',
    hierarchy: [
      'Community',
      'Assisted Living Services',
      'Facilities and Nursing Homes',
    ],
  },
  {
    category_id: testId3,
    group: 'place',
    hierarchy: ['Community', 'Assisted Living Services', 'Caretakers'],
  },
]

describe('Categories', () => {
  let request: supertest.SuperTest<supertest.Test>

  beforeAll(function () {
    request = supertest.agent(app)
  })
  afterAll(function () {
    app.close()
  })

  // it('should return a list of categories', async () => {
  // const cats = await plaid.categoriesGet({})

  //   fs.writeFileSync('categories.json', JSON.stringify(cats.data.categories))
  //   expect(cats).toBeDefined()
  // })

  it('should create categories', async () => {
    const {
      data: { categories: _categories },
    } = await plaid.categoriesGet({})

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

    console.log('res: ', res)
    expect(res).toBeDefined()

    // expect(res.status).toBe(200)
  })
})
