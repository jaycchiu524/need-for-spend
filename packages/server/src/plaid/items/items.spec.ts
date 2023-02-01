import { nanoid } from 'nanoid'
import supertest from 'supertest'

import app from '@/app'

import { CreateItemInput } from './dao'
import { itemsServices } from './services'

let firstUserIdTest = '' // used to store the id of the first user created for testing purposes

const requestBody = {
  email: `test${nanoid()}@test.com`,
  password: 'test123',
  firstName: 'John',
  lastName: 'Doe',
}

const testItem: CreateItemInput = {
  plaidAccessToken: nanoid(),
  plaidItemId: nanoid(),
  plaidInstitutionId: nanoid(),
  plaidInstitutionName: 'Test Bank',
  userId: '',
}

let accessToken = '' // used to store the token of the first user created for testing purposes
let refreshToken = '' // used to store the refresh token of the first user created for testing purposes
let itemId = '' // used to store the id of the first item created for testing purposes

describe('Items', () => {
  let request: supertest.SuperTest<supertest.Test>
  beforeAll(function () {
    request = supertest.agent(app)
  })
  afterAll(function () {
    app.close()
  })

  /** Create User */
  it('should create a new user for testing items', async () => {
    const response = await request.post('/auth/register').send(requestBody)
    firstUserIdTest = response.body.id
    accessToken = response.body.accessToken
    refreshToken = response.body.refreshToken

    testItem.userId = firstUserIdTest
  })

  /** Create Item */
  it('should create a new item', async () => {
    const item = await itemsServices.createItem(testItem)

    expect(item).toHaveProperty('id')
    expect(item).toHaveProperty('plaidItemId')
    expect(item).toHaveProperty('plaidInstitutionId')
    expect(item).toHaveProperty('plaidInstitutionName')
    expect(item).toHaveProperty('transactionsCursor')
    expect(item).toHaveProperty('userId')
    expect(item).toHaveProperty('createdAt')
    expect(item).toHaveProperty('updatedAt')

    expect(item).not.toHaveProperty('plaidAccessToken')

    item.id && (itemId = item.id)
  })

  /** Get Item By id */
  it('should get an item', async () => {
    const item = await itemsServices.getItemById(itemId)

    expect(item).toHaveProperty('id')
    expect(item).toHaveProperty('plaidItemId')
    expect(item).toHaveProperty('plaidInstitutionId')
    expect(item).toHaveProperty('plaidInstitutionName')
    expect(item).toHaveProperty('transactionsCursor')
    expect(item).toHaveProperty('userId')
    expect(item).toHaveProperty('createdAt')
    expect(item).toHaveProperty('updatedAt')

    expect(item).not.toHaveProperty('plaidAccessToken')
  })

  /** Get Items By User Id */
  it('should get items by user id', async () => {
    const items = await itemsServices.getItemsByUserId(firstUserIdTest)

    expect(items).toHaveLength(1)

    expect(items[0]).toHaveProperty('id')
    expect(items[0]).toHaveProperty('plaidItemId')
    expect(items[0]).toHaveProperty('plaidInstitutionId')
    expect(items[0]).toHaveProperty('plaidInstitutionName')
    expect(items[0]).toHaveProperty('transactionsCursor')
    expect(items[0]).toHaveProperty('userId')
    expect(items[0]).toHaveProperty('createdAt')
    expect(items[0]).toHaveProperty('updatedAt')

    expect(items[0]).not.toHaveProperty('plaidAccessToken')
  })

  /** Get Items By Plaid item Id */
  it('should get an item by plaid item id', async () => {
    const item = await itemsServices.getItemByPlaidItemId(testItem.plaidItemId)

    expect(item).toHaveProperty('id')
    expect(item).toHaveProperty('plaidAccessToken')
    expect(item).toHaveProperty('plaidItemId')
    expect(item).toHaveProperty('plaidInstitutionId')
    expect(item).toHaveProperty('plaidInstitutionName')
    expect(item).toHaveProperty('transactionsCursor')
    expect(item).toHaveProperty('userId')
    expect(item).toHaveProperty('createdAt')
    expect(item).toHaveProperty('updatedAt')
  })

  /** Update Item */
  it('should update an item transaction cursor', async () => {
    const transactionsCursor = `test-${nanoid()}`
    const item = await itemsServices.updateItemTransactionsCursor(
      testItem.plaidItemId,
      transactionsCursor,
    )

    expect(item).toHaveProperty('id')
    expect(item).toHaveProperty('plaidItemId')
    expect(item).toHaveProperty('plaidInstitutionId')
    expect(item).toHaveProperty('plaidInstitutionName')
    expect(item).toHaveProperty('transactionsCursor')
    expect(item).toHaveProperty('userId')
    expect(item).toHaveProperty('createdAt')
    expect(item).toHaveProperty('updatedAt')

    expect(item).not.toHaveProperty('plaidAccessToken')

    expect(item.transactionsCursor).toBe(transactionsCursor)
  })
})
