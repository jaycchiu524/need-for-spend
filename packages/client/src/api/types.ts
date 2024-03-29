export type ErrorResponse = {
  code: number
  message: string
}

export type Institution = {
  institution_id: string
  name: string
  url?: string | null
  primary_color?: string | null
  /**
   * Base64 encoded representation of the institution\'s logo
   * @type {string}
   * @memberof Institution
   */
  logo?: string | null
}

/** ------- Generated by Prisma ----------- */

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
  plaidInstitutionId: string
  plaidInstitutionName: string
  transactionsCursor: string | null
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
  itemId: string
  plaidAccountId: string
  name: string
  type: string
  subtype: string | null
  mask: string | null
  officialName: string | null
  balanceAvailable: number | null
  balanceCurrent: number | null
  balanceLimit: number | null
  balanceIsoCurrencyCode: string | null
  balanceUnofficialCurrencyCode: string | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Model Transaction
 *
 */
export type Transaction = {
  id: string
  plaidTransactionId: string
  accountId: string
  date: string
  datetime: string | null
  address: string | null
  name: string | null
  amount: number
  isoCurrencyCode: string | null
  unofficialCurrencyCode: string | null
  plaidCategoryId: string | null
  pending: boolean
  accountOwner: string | null
  createdAt: Date
  updatedAt: Date
} & {
  category: Pick<Category, 'name'>
}

/**
 * Model Category
 *
 */
export type Category = {
  plaidCategoryId: string
  name: string
  group: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Model Subcategory
 *
 */
export type Subcategory = {
  name: string
  depth: number
  createdAt: Date
  updatedAt: Date
}

/**
 * Model CategoriesOnSubcategories
 *
 */
export type CategoriesOnSubcategories = {
  plaidCategoryId: string
  subcategoryName: string
  createdAt: Date
  updatedAt: Date
}
