import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { NextPage } from 'next'
import { ReactElement, ReactNode } from 'react'

import { useAuthStore, useThemeStore } from '@/store/store'

import { api } from '@/api'

import type { AppProps } from 'next/app'

const queryClient = new QueryClient()

export type NextPageWithLayout<P = any, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page)

  const theme = useThemeStore((state) => state.theme)
  const token = useAuthStore((state) => state.auth.token)
  if (token && !api.defaults.headers.common['Authorization']) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {getLayout(<Component {...pageProps} />)}
      </ThemeProvider>
    </QueryClientProvider>
  )
}
