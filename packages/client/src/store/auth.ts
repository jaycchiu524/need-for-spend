import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

type Token = {
  id: string
  accessToken: string
  refreshToken: string
  exp: number
}

interface AuthState {
  auth: Token | null
  setToken: (token: Token | null) => void
  logout: () => void
}

const initialAuthState: Token = {
  id: '',
  accessToken: '',
  refreshToken: '',
  exp: -1,
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        auth: initialAuthState,
        setToken: (token) => set(() => ({ auth: token })),
        logout: () => {
          set(() => ({ auth: null }))
          localStorage.removeItem('persist:auth-storage')
        },
      }),
      {
        name: 'auth-storage',
      },
    ),
  ),
)
