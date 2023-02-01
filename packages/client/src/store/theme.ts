import { createTheme, Theme } from '@mui/material/styles'
import { create } from 'zustand'

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
