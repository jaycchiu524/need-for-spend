import debug from 'debug'

import argon2 from 'argon2'

import { prisma } from '@/configs/prismaClient'
import { categoriesServices } from '@/plaid/categories/services'
import { usersServices } from '@/users/users.services'

// Database seeding happens in two ways with Prisma:
// 1. manually with prisma db seed
// 2. automatically in prisma migrate dev and prisma migrate reset.

const log = debug('prisma-seeding')

const populateCategories = categoriesServices.syncPlaidCategories

const createAdmin = async () => {
  if (!process.env.ADMIN_PASSWORD) {
    log('No admin password provided. Using default password')
    throw new Error('No admin password provided. Using default password')
  }

  const encryptedPassword = await argon2.hash(process.env.ADMIN_PASSWORD)
  await usersServices.createAdmin({
    email: 'admin@nfs.com',
    password: encryptedPassword,
    firstName: 'Admin',
    lastName: 'Admin',
  })
}

const main = async () => {
  log('Seeding: Populating categories')
  await populateCategories()

  log('Seeding: Creating admin')
  console.log('🌱 Seeding: Creating admin')
  await createAdmin()
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
