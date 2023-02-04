import { create } from 'zustand'

// hash table of link tokens
interface LinkToken {
  [id: string]: string
}

interface linkTokenState {
  users: LinkToken
  items: LinkToken
  setUserLink: (data: { userId: string; token: string }) => void
  setItemLink: (data: { itemId: string; token: string }) => void
  deleteLinkToken: (userId: string | null, itemId: string | null) => void
}

export const useLinkTokenStore = create<linkTokenState>((set) => ({
  users: {},
  items: {},
  setUserLink: ({ userId, token }: { userId: string; token: string }) =>
    set((state) => ({ users: { ...state.users, [userId]: token } })),
  setItemLink: ({ itemId, token }: { itemId: string; token: string }) =>
    set((state) => ({ items: { ...state.items, [itemId]: token } })),
  deleteLinkToken: (userId: string | null, itemId: string | null) => {
    if (!userId && !itemId) return
    if (userId) {
      set((state) => {
        const { [userId]: _, ...users } = state.users
        return { users }
      })
    } else if (itemId) {
      set((state) => {
        const { [itemId]: _, ...items } = state.items
        return { items }
      })
    }
  },
}))
