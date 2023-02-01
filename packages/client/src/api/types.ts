export type ErrorResponse = {
  code: number
  message: string
}

/**
 * Model User
 *
 */
export type User = {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  role: number
  createdAt: Date
  updatedAt: Date
}

/**
 * Model Item
 *
 */
export type Item = {
  id: string
  plaidAccessToken: string
  plaidItemId: string
  institutionId: string
  institutionName: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Model Account
 *
 */
export type Account = {
  id: string
  accountId: string
  name: string
  type: string
  subtype: string
  mask: string
  officialName: string
  balanceAvailable: number
  balanceCurrent: number
  balanceLimit: number
  balanceIsoCurrencyCode: string
  balanceUnofficialCurrencyCode: string
  itemId: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Model Transaction
 *
 */
export type Transaction = {
  id: string
  transactionId: string
  accountId: string
  date: Date
  address: string
  name: string
  amount: number
  isoCurrencyCode: string
  unofficialCurrencyCode: string
  categoryId: string
  nextCursor: string
  pending: boolean
  accountOwner: string
  createdAt: Date
  updatedAt: Date
}
