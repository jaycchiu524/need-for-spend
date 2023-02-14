import { create } from 'zustand'

import { AccountType } from '@/api/accounts'

interface AccountState {
  byUser: { [key: string]: AccountType[] }
  byId: { [key: string]: AccountType }
  setUserAccounts: (userId: string, accounts: AccountType[]) => void
  setIdAccounts: (id: string, account: AccountType) => void
}

export const useAccountStore = create<AccountState>((set) => ({
  byUser: {},
  byId: {},
  setUserAccounts: (userId, accounts) =>
    set(({ byUser }) => ({
      byUser: { ...byUser, [userId]: accounts },
    })),
  setIdAccounts: (id, account) =>
    set(({ byId }) => ({
      byId: { ...byId, [id]: account },
    })),
}))
