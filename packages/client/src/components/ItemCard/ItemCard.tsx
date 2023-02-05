import * as React from 'react'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import SavingsIcon from '@mui/icons-material/Savings'
import CreditCardIcon from '@mui/icons-material/CreditCard'

import { useQuery } from '@tanstack/react-query'

import { useRouter } from 'next/router'

import { ItemType } from '@/api/items'
import { getAccountByItemId } from '@/api/accounts'

type Props = {
  item: ItemType
}

const ItemCard = ({ item }: Props) => {
  const [open, setOpen] = React.useState(false)

  const handleClick = React.useCallback(() => {
    setOpen((prev) => !prev)
  }, [])

  const { data, isLoading } = useQuery({
    queryKey: ['itemById', item.id],
    queryFn: () => getAccountByItemId(item.id),
    enabled: open,
    cacheTime: 60 * 1000,
  })

  const accounts = data?.data || []

  const router = useRouter()

  return (
    <List
      sx={{ width: '100%' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      // subheader={
      //   <ListSubheader component="div" id="nested-list-subheader">
      //     {item.plaidInstitutionName}
      //   </ListSubheader>
      // }
    >
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <AccountBalanceIcon />
        </ListItemIcon>
        <ListItemText primary={item.plaidInstitutionName} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          accounts.sort().map((account) => {
            /**
             * export declare enum AccountType {
              Investment = "investment",
              Credit = "credit",
              Depository = "depository",
              Loan = "loan",
              Brokerage = "brokerage",
              Other = "other"
             */
            const isDepository = account.type === 'depository'
            const handleAccountClick = () => {
              router.push(`/account/${account.id}`)
            }

            return (
              <List
                key={account.id}
                component="div"
                disablePadding
                onClick={handleAccountClick}>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    {isDepository ? <SavingsIcon /> : <CreditCardIcon />}
                  </ListItemIcon>
                  <ListItemText primary={account.name} />
                </ListItemButton>
              </List>
            )
          })
        )}
      </Collapse>
    </List>
  )
}

export default ItemCard
