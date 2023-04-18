import debug from 'debug'

import { prisma } from '@/configs/prismaClient'
import { categoriesServices } from '@/plaid/categories/services'

// Database seeding happens in two ways with Prisma:
// 1. manually with prisma db seed
// 2. automatically in prisma migrate dev and prisma migrate reset.

const log = debug('prisma-seeding')

const populateCategories = categoriesServices.syncPlaidCategories

const main = async () => {
  log('Seeding: Populating categories')
  await populateCategories()
}

main()
  .then(async () => {
    log('Successfully populated categories')
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    log('Error populating categories: ', e)
    await prisma.$disconnect()
    process.exit(1)
  })
