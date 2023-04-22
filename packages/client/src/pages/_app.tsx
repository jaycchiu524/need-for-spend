import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { NextPage } from 'next'
import { ReactElement, ReactNode } from 'react'

import { ToastContainer } from 'react-toastify'

import { useThemeStore } from '@/store/theme'

import type { AppProps } from 'next/app'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

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

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {getLayout(<Component {...pageProps} />)}
        <ToastContainer />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
