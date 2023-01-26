import * as React from 'react'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import DashboardIcon from '@mui/icons-material/Dashboard'
import LogoutIcon from '@mui/icons-material/Logout'
import { useRouter } from 'next/router'

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import LockIcon from '@mui/icons-material/Lock'
// import WorkIcon from '@mui/icons-material/Work'
import PercentIcon from '@mui/icons-material/Percent'
import HandymanIcon from '@mui/icons-material/Handyman'
import InventoryIcon from '@mui/icons-material/Inventory'

import MenuButton from './MenuButton'

enum Menu {
  Dashboard,
  JobPost,
  Customer,
  Payment,
  TaxRate,
  DefaultSetup,
  Permission,
  Inventory,
}

export const MainListItems = () => {
  const router = useRouter()

  const [open, setOpen] = React.useState<Menu | null>(null)

  return (
    <React.Fragment>
      <ListItemButton
        onClick={() => {
          router.push('/main')
        }}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      {/* JobPost */}
      {/* <MenuButton
        open={open === Menu.JobPost}
        config={{
          title: 'Job Posts',
          submodules: [
            {
              title: 'Create',
              onClick: () => {
                router.push('/main/job-post/create')
              },
            },
          ],
          onClick: () => {
            setOpen((prev) => (prev === Menu.JobPost ? null : Menu.JobPost))
            router.push('/main/job-post')
          },
          icon: <WorkIcon />,
        }}
      /> */}

      <MenuButton
        open={open === Menu.Payment}
        config={{
          title: 'Payment',
          onClick: () => {
            router.push('/main/payment')
          },
          icon: <AccountBalanceWalletIcon />,
        }}
      />

      <MenuButton
        open={open === Menu.TaxRate}
        config={{
          title: 'Tax Rate',
          onClick: () => {
            router.push('/main/tax-rate')
          },
          icon: <PercentIcon />,
        }}
      />

      {/* Customer */}
      <MenuButton
        open={open === Menu.Customer}
        config={{
          title: 'Customers',
          submodules: [
            {
              title: 'Create',
              onClick: () => {
                router.push('/main/customer/create')
              },
            },
          ],
          onClick: () => {
            setOpen((prev) => (prev === Menu.Customer ? null : Menu.Customer))
            router.push('/main/customer')
          },
        }}
      />

      {/* Permission */}
      <MenuButton
        config={{
          title: 'Permission',
          onClick: () => {
            setOpen((prev) =>
              prev === Menu.Permission ? null : Menu.Permission,
            )
            router.push('/main/permission')
          },
          icon: <LockIcon />,
        }}
      />

      <MenuButton
        open={open === Menu.DefaultSetup}
        config={{
          title: 'Default Setup',
          onClick: () => {
            router.push('/main/default-setup')
          },
          icon: <HandymanIcon />,
        }}
      />

      <MenuButton
        open={open === Menu.Inventory}
        config={{
          title: 'Inventory',
          onClick: () => {
            router.push('/main/inventory')
          },
          icon: <InventoryIcon />,
        }}
      />
    </React.Fragment>
  )
}

export const SecondaryListItems = ({ onLogout }: { onLogout: () => void }) => (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Actions
    </ListSubheader>
    <ListItemButton data-testid="logout-button" onClick={onLogout}>
      <ListItemIcon>
        <LogoutIcon />
      </ListItemIcon>
      <ListItemText primary="Logout" />
    </ListItemButton>
  </React.Fragment>
)
