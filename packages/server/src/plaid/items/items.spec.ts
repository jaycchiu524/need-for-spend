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
  })
})
