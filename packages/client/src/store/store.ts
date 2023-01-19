import { createTheme, Theme } from '@mui/material/styles'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

type Token = {
  id: string
  accessToken: string
  refreshToken: string
  exp: number
}

interface AuthState {
  auth: Token
  setToken: (token: Token) => void
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
        logout: () => set(() => ({ auth: initialAuthState })),
      }),
      {
        name: 'auth-storage',
      },
    ),
  ),
)

interface ThemeState {
  theme: Theme
  setTheme: (theme: 'dark' | 'light') => void
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
})

const initialThemeState: Theme = lightTheme

export const useThemeStore = create<ThemeState>()((set) => ({
  theme: initialThemeState,
  setTheme: (theme) =>
    set(() => ({ theme: theme === 'dark' ? darkTheme : lightTheme })),
}))
