import * as React from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import DarkModeIcon from '@mui/icons-material/DarkMode'

import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew'
import Arrow from '@mui/icons-material/ArrowBackIosNew'
import { useRouter } from 'next/router'

import { Breadcrumbs, IconButton, Tooltip } from '@mui/material'

import { useAuthStore } from '@/store/auth'

import { useThemeStore } from '@/store/theme'

import { refreshToken } from '@/auth/refreshToken'

import Sockets from '../Socket'

// const drawerWidth: number = 240

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  // ...(open && {
  //   marginLeft: drawerWidth,
  //   width: `calc(100% - ${drawerWidth}px)`,
  //   transition: theme.transitions.create(['width', 'margin'], {
  //     easing: theme.transitions.easing.sharp,
  //     duration: theme.transitions.duration.enteringScreen,
  //   }),
  // }),
}))

// const Drawer = styled(MuiDrawer, {
//   shouldForwardProp: (prop) => prop !== 'open',
// })(({ theme, open }) => ({
//   '& .MuiDrawer-paper': {
//     position: 'relative',
//     whiteSpace: 'nowrap',
//     width: drawerWidth,
//     transition: theme.transitions.create('width', {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//     boxSizing: 'border-box',
//     ...(!open && {
//       overflowX: 'hidden',
//       transition: theme.transitions.create('width', {
//         easing: theme.transitions.easing.sharp,
//         duration: theme.transitions.duration.leavingScreen,
//       }),
//       width: theme.spacing(7),
//       [theme.breakpoints.up('sm')]: {
//         width: theme.spacing(9),
//       },
//     }),
//   },
// }))

function MainLayout({
  title,
  back = false,
  children,
}: {
  title?: string
  back?: boolean
  children: React.ReactNode
}) {
  const router = useRouter()
  const auth = useAuthStore((state) => state.auth)
  const _logout = useAuthStore((state) => state.logout)
  const logout = React.useCallback(() => {
    _logout()
    router.push('/login')
  }, [_logout, router])

  const { setTheme, theme } = useThemeStore()

  React.useEffect(() => {
    ;(async () => {
      if (!auth?.accessToken || auth.exp * 1000 < Date.now()) {
        try {
          await refreshToken()
        } catch (err) {
          logout()
          return
        }
      }
    })()
  }, [auth, logout, router])

  return (
    <Box sx={{ display: 'flex' }}>
      <Sockets />
      <AppBar position="absolute">
        <Toolbar
          sx={{
            pr: '24px', // keep right padding when drawer closed
          }}>
          {back && (
            <Tooltip title="Logout">
              <IconButton
                aria-label="dark-mode-switch"
                component="label"
                onClick={() => {
                  router.back()
                }}>
                <Arrow />
              </IconButton>
            </Tooltip>
          )}
          <Breadcrumbs sx={{ flexGrow: 1 }} aria-label="breadcrumb">
            <Typography component="h1" variant="h6" color="inherit">
              {title || ' Need For Spend'}
            </Typography>
          </Breadcrumbs>
          <Tooltip title="Toggle light/dark mode">
            <IconButton
              color="inherit"
              aria-label="dark-mode-switch"
              component="label"
              onClick={() =>
                setTheme(theme.palette.mode === 'light' ? 'dark' : 'light')
              }>
              {theme.palette.mode === 'light' ? (
                <Brightness7Icon />
              ) : (
                <DarkModeIcon />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title="Logout">
            <IconButton
              color="error"
              aria-label="dark-mode-switch"
              component="label"
              onClick={logout}>
              <PowerSettingsNewIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}>
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  )
}

export default MainLayout
