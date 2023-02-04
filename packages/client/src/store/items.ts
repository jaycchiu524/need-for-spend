import { create } from 'zustand'

import { ItemType } from '@/api/items'

type Item = {
  [key: string]: ItemType[]
}

interface ItemState {
  byUser: Item
  byId: Item
  setUserItems: (userId: string, items: ItemType[]) => void
  setIdItems: (id: string, items: ItemType[]) => void
}

export const useItemStore = create<ItemState>((set) => ({
  byUser: {},
  byId: {},
  setUserItems: (userId, items) =>
    set(({ byUser }) => ({
      byUser: { ...byUser, [userId]: items },
    })),
  setIdItems: (id, items) =>
    set(({ byId }) => ({
      byId: { ...byId, [id]: items },
    })),
}))
