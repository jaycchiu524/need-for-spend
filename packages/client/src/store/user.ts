import { create } from 'zustand'

import { User } from '@/api/types'

type storedUser = Omit<User, 'password'>

interface UserState {
  user: storedUser | null
  setUser: (user: storedUser) => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
}))
