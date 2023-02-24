import { nanoid } from 'nanoid'
import supertest from 'supertest'

import app from '@/app'

import { Account, Transaction } from '@/generated/client'

import { CreateItemInput, itemsDao } from './items/dao'
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
  user: {
    connect: {
      id: '',
    },
  },
}

let accessToken = '' // used to store the token of the first user created for testing purposes
let refreshToken = '' // used to store the refresh token of the first user created for testing purposes
let itemId = '' // used to store the id of the first item created for testing purposes

let accAId = ''
let accBId = ''

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

    if (testItem.user.connect) testItem.user.connect.id = firstUserIdTest
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
    const removeTestId = [nanoid(), nanoid()]
    const updateTestId = [nanoid(), nanoid()]

    it('should create new transactions', async () => {
      const accountId_A = await accountsDao.getAccountByPlaidAccountId(
        testPlaidAccountId_A,
      )
      const accountId_B = await accountsDao.getAccountByPlaidAccountId(
        testPlaidAccountId_B,
      )

      if (!accountId_A || !accountId_B) {
        throw new Error('Account A/B not found')
      }
      expect(accountId_A).toHaveProperty('id')
      expect(accountId_B).toHaveProperty('id')

      // Total added transactions: 8
      const add = [
        {
          accountId: accountId_A.id,
          plaidTransactionId: removeTestId[0],
          amount: 5.4,
          isoCurrencyCode: 'USD',
          unofficialCurrencyCode: null,
          date: '2023-01-30',
          datetime: '2023-01-30T11:00:00Z',
          name: 'Uber 063015 SF**POOL**',
          address: null,
          plaidCategoryId: '22016000',
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
          plaidCategoryId: '22001000',
          accountOwner: null,
          pending: false,
        },
        {
          accountId: accountId_A.id,
          plaidTransactionId: removeTestId[1],
          amount: 12,
          isoCurrencyCode: 'USD',
          unofficialCurrencyCode: null,
          date: '2023-01-27',
          datetime: '2023-01-30T11:00:00Z',
          name: "McDonald's",
          address: null,
          plaidCategoryId: '13005032',
          accountOwner: null,
          pending: false,
        },
        {
          accountId: accountId_A.id,
          plaidTransactionId: updateTestId[0],
          amount: 4.33,
          isoCurrencyCode: 'USD',
          unofficialCurrencyCode: null,
          date: '2023-01-27',
          datetime: '2023-01-30T12:00:00Z',
          name: 'Starbucks',
          address: null,
          plaidCategoryId: '13005043',
          accountOwner: null,
          pending: false,
        },
        {
          accountId: accountId_A.id,
          plaidTransactionId: updateTestId[1],
          amount: 89.4,
          isoCurrencyCode: 'USD',
          unofficialCurrencyCode: null,
          date: '2023-01-26',
          name: 'SparkFun',
          address: null,
          plaidCategoryId: '13005000',
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
          plaidCategoryId: '22016000',
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
          datetime: '2023-01-30T10:00:00Z',
          name: 'CREDIT CARD 3333 PAYMENT *//',
          address: null,
          plaidCategoryId: '16001000',
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
          plaidCategoryId: '21005000',
          accountOwner: null,
          pending: false,
        },
      ]

      const transactions = await transactionsDao.syncTransactions(add, [], [])

      console.log('Create transactions', transactions)

      expect(transactions).toBeDefined()
    })

    it('should update and delete transactions', async () => {
      const accountId_A = await accountsDao.getAccountByPlaidAccountId(
        testPlaidAccountId_A,
      )
      const accountId_B = await accountsDao.getAccountByPlaidAccountId(
        testPlaidAccountId_B,
      )

      if (!accountId_A || !accountId_B) {
        throw new Error('Account A/B not found')
      }

      accAId = accountId_A.id
      accBId = accountId_B.id

      const update = [
        {
          accountId: accountId_A.id,
          plaidTransactionId: updateTestId[0],
          amount: 69,
          isoCurrencyCode: 'USD',
          unofficialCurrencyCode: null,
          date: '2023-01-27',
          name: 'Starbucks',
          address: null,
          plaidCategoryId: '13005043',
          accountOwner: null,
          pending: false,
        },
        {
          accountId: accountId_A.id,
          plaidTransactionId: updateTestId[1],
          amount: 8964,
          isoCurrencyCode: 'USD',
          unofficialCurrencyCode: null,
          date: '2023-01-26',
          name: 'SparkFun',
          address: null,
          plaidCategoryId: '13005000',
          accountOwner: null,
          pending: false,
        },
      ]

      const remove = [
        {
          transaction_id: removeTestId[1],
        },
        {
          transaction_id: removeTestId[0],
        },
      ]

      await transactionsDao.syncTransactions([], update, remove)

      const transactions = await transactionsDao.getTransactionsByItemId(itemId)

      expect(transactions.length).toBe(6)
      expect(
        transactions.find((t) => t.plaidTransactionId === removeTestId[0]),
      ).toBeUndefined()
      expect(
        transactions.find((t) => t.plaidTransactionId === removeTestId[1]),
      ).toBeUndefined()
      expect(
        transactions.find((t) => t.plaidTransactionId === updateTestId[0])
          ?.amount,
      ).toBe(69)
      expect(
        transactions.find((t) => t.plaidTransactionId === updateTestId[1])
          ?.amount,
      ).toBe(8964)
    })

    it('should get spending sum of transactions by day', async () => {
      const add = [
        {
          accountId: accAId,
          plaidTransactionId: nanoid(),
          amount: 69,
          isoCurrencyCode: 'USD',
          unofficialCurrencyCode: null,
          date: '2023-02-27',
          name: 'Starbucks',
          address: null,
          plaidCategoryId: '13005043',
          accountOwner: null,
          pending: false,
        },
        {
          accountId: accAId,
          plaidTransactionId: nanoid(),
          amount: 89.64,
          isoCurrencyCode: 'USD',
          unofficialCurrencyCode: null,
          date: '2023-03-26',
          name: 'SparkFun',
          address: null,
          plaidCategoryId: '13005000',
          accountOwner: null,
          pending: false,
        },
        {
          accountId: accAId,
          plaidTransactionId: nanoid(),
          amount: 2212,
          isoCurrencyCode: 'USD',
          unofficialCurrencyCode: null,
          date: '2022-12-27',
          name: 'Starbucks',
          address: null,
          plaidCategoryId: '13005043',
          accountOwner: null,
          pending: false,
        },
        {
          accountId: accAId,
          plaidTransactionId: nanoid(),
          amount: 2303,
          isoCurrencyCode: 'USD',
          unofficialCurrencyCode: null,
          date: '2023-03-26',
          name: 'SparkFun',
          address: null,
          plaidCategoryId: '13005000',
          accountOwner: null,
          pending: false,
        },
        {
          accountId: accAId,
          plaidTransactionId: nanoid(),
          amount: -2303,
          isoCurrencyCode: 'USD',
          unofficialCurrencyCode: null,
          date: '2023-04-26',
          name: 'SparkFun',
          address: null,
          plaidCategoryId: '13005000',
          accountOwner: null,
          pending: false,
        },
      ]

      await transactionsDao.syncTransactions(add, [], [])

      const config = {
        startDate: '2023-01-01',
        endDate: '2023-03-31',
      }
      const dayWithStartEnd = await transactionsDao.getSpendingSumByDay(
        accAId,
        config,
      )
      const dayNoConfigs = await transactionsDao.getSpendingSumByDay(accAId, {})

      expect(dayWithStartEnd).toBeDefined()
      expect(dayNoConfigs).toBeDefined()
      expect(dayWithStartEnd.length).toBeGreaterThan(1)
      expect(dayWithStartEnd.length).toBeGreaterThan(0)

      const first = dayWithStartEnd[0]
      const second = dayWithStartEnd[1]
      const last = dayWithStartEnd[dayWithStartEnd.length - 1]
      const firstDate = new Date(
        `${first.year}-${first.month}-${first.day}`,
      ).getTime()
      const secondDate = new Date(
        `${second.year}-${second.month}-${second.day}`,
      ).getTime()
      const lastDate = new Date(
        `${last.year}-${last.month}-${last.day}`,
      ).getTime()
      const filterNegative = dayWithStartEnd.filter((d) => d.sum < 0)

      expect(first).toHaveProperty('day')
      expect(first).toHaveProperty('sum')
      expect(firstDate).toBeGreaterThanOrEqual(secondDate)
      expect(firstDate).toBeLessThanOrEqual(new Date(config.endDate).getTime())
      expect(lastDate).toBeGreaterThanOrEqual(
        new Date(config.startDate).getTime(),
      )
      expect(filterNegative.length).toBe(0)
    })
  })

  describe('Endpoints', () => {
    it('should get item by item id', async () => {
      const response = await request
        .get(`/items/${itemId}`)
        .set('Authorization', `Bearer ${accessToken}`)

      const item = response.body

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

    it('should not get item by item id if not authorized', async () => {
      const response = await request.get(`/items/${itemId}`)
      expect(response.status).toBe(401)
    })

    it('should return 404 if item not found', async () => {
      const response = await request
        .get(`/items/nonexistent-item-id`)
        .set('Authorization', `Bearer ${accessToken}`)
      expect(response.status).toBe(404)
    })

    it('should get accounts by item id', async () => {
      const response = await request
        .get(`/items/${itemId}/accounts`)
        .set('Authorization', `Bearer ${accessToken}`)

      const accounts = response.body as Account[]

      expect(response.status).toBe(200)

      expect(accounts.length).toBe(2)
      expect(accounts[0]).toHaveProperty('id')
      expect(accounts[0]).toHaveProperty('plaidAccountId')
    })

    it('should get transactions by account id', async () => {
      const response = await request
        .get(`/accounts/${accAId}/transactions`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.status).toBe(200)

      const transactions = response.body as Transaction[]

      // expect(transactions.length).toBe(6)
      expect(transactions[0]).toHaveProperty('id')
      expect(transactions[0]).toHaveProperty('plaidTransactionId')
      expect(new Date(transactions[0].date).getTime()).toBeGreaterThanOrEqual(
        new Date(transactions[1].date).getTime(),
      )
    })

    it('should get transactions by account id on page 2', async () => {
      const response = await request
        .get(`/accounts/${accAId}/transactions/?take=2&skip=2&sort=asc`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.status).toBe(200)

      const transactions = response.body as Transaction[]

      expect(transactions.length).toBe(2)
      expect(transactions[0]).toHaveProperty('id')
      expect(transactions[0]).toHaveProperty('plaidTransactionId')
      expect(new Date(transactions[0].date).getTime()).toBeLessThan(
        new Date(transactions[1].date).getTime(),
      )
    })

    it('should get transactions by account id with start date', async () => {
      const response = await request
        .get(`/accounts/${accBId}/transactions?startDate=2023-01-30`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.status).toBe(200)

      const transactions = response.body as Transaction[]

      expect(transactions.length).toBe(1)
      expect(transactions[0]).toHaveProperty('id')
      expect(transactions[0]).toHaveProperty('plaidTransactionId')
      expect(transactions[0].date).toBe('2023-01-30')
    })

    it('should all related records when deleting a item record', async () => {
      const item = await itemsDao.getItemById(itemId)
      const accounts = await accountsDao.getAccountsByItemId(itemId)
      const transactions = await transactionsDao.getTransactionsByItemId(itemId)

      expect(item).not.toBeNull()
      expect(accounts.length).not.toBe(0)
      expect(transactions.length).not.toBe(0)

      await request
        .delete(`/items/${itemId}`)
        .set('Authorization', `Bearer ${accessToken}`)

      const itemAfterDelete = await itemsDao.getItemById(itemId)
      const accountsAfterDelete = await accountsDao.getAccountsByItemId(itemId)
      const transactionsAfterDelete =
        await transactionsDao.getTransactionsByItemId(itemId)

      expect(itemAfterDelete).toBeNull()
      expect(accountsAfterDelete.length).toBe(0)
      expect(transactionsAfterDelete.length).toBe(0)
    })
  })
})
