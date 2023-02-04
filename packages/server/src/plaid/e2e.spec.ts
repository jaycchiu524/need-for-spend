import { nanoid } from 'nanoid'
import supertest from 'supertest'

import app from '@/app'

import { CreateItemInput } from './items/dao'
import { itemsServices } from './items/services'
import { accountsDao } from './accounts/dao'

import { transactionsDao } from './transactions/dao'

let firstUserIdTest = '' // used to store the id of the first user created for testing purposes

const requestBody = {
  email: `test${nanoid()}@test.com`,
  password: 'test123',
  firstName: 'John',
  lastName: 'Doe',
}

const testPlaidItemId = nanoid()
const testPlaidAccountId_A = nanoid()
const testPlaidAccountId_B = nanoid()

const testItem: CreateItemInput = {
  plaidAccessToken: nanoid(),
  plaidItemId: testPlaidItemId,
  plaidInstitutionId: nanoid(),
  plaidInstitutionName: 'Test Bank',
  userId: '',
}

let accessToken = '' // used to store the token of the first user created for testing purposes
let refreshToken = '' // used to store the refresh token of the first user created for testing purposes
let itemId = '' // used to store the id of the first item created for testing purposes

describe('Create items, accounts and transactions', () => {
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

  describe('Items', () => {
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
      const item = await itemsServices.getItemByPlaidItemId(
        testItem.plaidItemId,
      )

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

  describe('Accounts', () => {
    it('should create new accounts', async () => {
      const accounts = await accountsDao.createAccounts([
        {
          itemId: itemId,
          plaidAccountId: testPlaidAccountId_A,
          name: 'Plaid Checking',
          type: 'depository',
          subtype: 'checking',
          mask: '0000',
          officialName: 'Plaid Gold Standard 0% Interest Checking',
          balanceAvailable: 100,
          balanceCurrent: 110,
          balanceLimit: null,
          balanceIsoCurrencyCode: 'USD',
          balanceUnofficialCurrencyCode: null,
        },
        {
          itemId: itemId,
          plaidAccountId: testPlaidAccountId_B,
          name: 'Plaid Saving',
          type: 'depository',
          subtype: 'savings',
          mask: '1111',
          officialName: 'Plaid Silver Standard 0.1% Interest Saving',
          balanceAvailable: 200,
          balanceCurrent: 210,
          balanceLimit: null,
          balanceIsoCurrencyCode: 'USD',
          balanceUnofficialCurrencyCode: null,
        },
      ])

      console.log('Create accounts', accounts)

      expect(accounts.count).toBe(2)
    })
  })

  describe('Transactions', () => {
    it('should create new transactions', async () => {
      const accountId_A = await accountsDao.getAccountByPlaidAccountId(
        testPlaidAccountId_A,
      )
      const accountId_B = await accountsDao.getAccountByPlaidAccountId(
        testPlaidAccountId_B,
      )

      expect(accountId_A).toHaveProperty('id')
      expect(accountId_B).toHaveProperty('id')

      if (!accountId_A || !accountId_B) {
        throw new Error('Account A/B not found')
      }

      const transactions = await transactionsDao.createTransactions([
        {
          accountId: accountId_A.id,
          plaidTransactionId: nanoid(),
          amount: 5.4,
          isoCurrencyCode: 'USD',
          unofficialCurrencyCode: null,
          date: '2023-01-30',
          name: 'Uber 063015 SF**POOL**',
          address: null,
          categoryId: '22016000',
          accountOwner: null,
          pending: false,
        },
        {
          accountId: accountId_A.id,
          plaidTransactionId: nanoid(),
          amount: -500,
          isoCurrencyCode: 'USD',
          unofficialCurrencyCode: null,
          date: '2023-01-28',
          name: 'United Airlines',
          address: null,
          categoryId: '22001000',
          accountOwner: null,
          pending: false,
        },
        {
          accountId: accountId_A.id,
          plaidTransactionId: nanoid(),
          amount: 12,
          isoCurrencyCode: 'USD',
          unofficialCurrencyCode: null,
          date: '2023-01-27',
          name: "McDonald's",
          address: null,
          categoryId: '13005032',
          accountOwner: null,
          pending: false,
        },
        {
          accountId: accountId_A.id,
          plaidTransactionId: nanoid(),
          amount: 4.33,
          isoCurrencyCode: 'USD',
          unofficialCurrencyCode: null,
          date: '2023-01-27',
          name: 'Starbucks',
          address: null,
          categoryId: '13005043',
          accountOwner: null,
          pending: false,
        },
        {
          accountId: accountId_A.id,
          plaidTransactionId: nanoid(),
          amount: 89.4,
          isoCurrencyCode: 'USD',
          unofficialCurrencyCode: null,
          date: '2023-01-26',
          name: 'SparkFun',
          address: null,
          categoryId: '13005000',
          accountOwner: null,
          pending: false,
        },
        {
          accountId: accountId_A.id,
          plaidTransactionId: nanoid(),
          amount: 6.33,
          isoCurrencyCode: 'USD',
          unofficialCurrencyCode: null,
          date: '2023-01-13',
          name: 'Uber 072515 SF**POOL**',
          address: null,
          categoryId: '22016000',
          accountOwner: null,
          pending: false,
        },
        {
          accountId: accountId_B.id,
          plaidTransactionId: nanoid(),
          amount: 25,
          isoCurrencyCode: 'USD',
          unofficialCurrencyCode: null,
          date: '2023-01-30',
          name: 'CREDIT CARD 3333 PAYMENT *//',
          address: null,
          categoryId: '16001000',
          accountOwner: null,
          pending: false,
        },
        {
          accountId: accountId_B.id,
          plaidTransactionId: nanoid(),
          amount: -4.22,
          isoCurrencyCode: 'USD',
          unofficialCurrencyCode: null,
          date: '2023-01-25',
          name: 'INTRST PYMNT',
          address: null,
          categoryId: '21005000',
          accountOwner: null,
          pending: false,
        },
      ])

      console.log('Create transactions', transactions)

      expect(transactions.count).toBe(8)
    })
  })
})
