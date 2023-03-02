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

import Image from 'next/image'

import { ItemType } from '@/api/items'
import { getAccountByItemId } from '@/api/accounts'
import { getInstitutionById } from '@/api/institutions'
import { useAccountStore } from '@/store/accounts'

import { useAuthStore } from '@/store/auth'

type Props = {
  item: ItemType
}

function formatLogoSrc(src: string) {
  return src && `data:image/jpeg;base64,${src}`
}

const ItemCard = ({ item }: Props) => {
  const [open, setOpen] = React.useState(false)

  const { auth } = useAuthStore()
  const { setUserAccounts, setIdAccounts } = useAccountStore()

  const handleClick = React.useCallback(() => {
    setOpen((prev) => !prev)
  }, [])

  const { data, isLoading } = useQuery({
    queryKey: ['itemById', item.id],
    queryFn: () => getAccountByItemId(item.id),
    enabled: open,
    onSuccess(data) {
      if (!data) return

      const { data: accounts } = data
      accounts.forEach((account) => {
        const { id } = account
        setIdAccounts(id, account)
      })

      if (!auth) return

      const userId = auth.id
      setUserAccounts(userId, accounts)
    },
  })

  const { data: _institution, isLoading: insLoading } = useQuery({
    queryKey: ['institutionId', item.plaidInstitutionId],
    queryFn: () => getInstitutionById(item.plaidInstitutionId),
    enabled: !!item.plaidInstitutionId,
  })

  const accounts = data?.data || []
  const institution = _institution?.data

  const router = useRouter()

  return (
    <List
      sx={{
        width: '100%',
        // bgcolor: institution?.primary_color + 'cc' || 'inherit',
        borderLeft: '2px solid',
        borderColor: institution?.primary_color + 'cc' || 'inherit',

        // borderRadius: '5px',
        marginY: '10px',
      }}
      component="nav"
      aria-labelledby={`${institution?.name}-account-list`}>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          {!insLoading && institution?.logo ? (
            <Image
              src={formatLogoSrc(institution?.logo || 'Logo not found')}
              alt={(institution && institution.name) || 'Institution Logo'}
              width={25}
              height={25}
            />
          ) : (
            <AccountBalanceIcon />
          )}
        </ListItemIcon>
        <ListItemText primary={item.plaidInstitutionName} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        {accounts.length > 0 &&
          accounts.map((account) => {
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
                    {isDepository ? (
                      <SavingsIcon
                        fontSize="small"
                        sx={{
                          color: institution?.primary_color || 'inherit',
                        }}
                      />
                    ) : (
                      <CreditCardIcon
                        fontSize="small"
                        sx={{
                          color: institution?.primary_color || 'inherit',
                        }}
                      />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={account.name} />
                </ListItemButton>
                {/* <Divider
                  variant="middle"
                  sx={{ background: institution?.primary_color || 'inherit' }}
                /> */}
              </List>
            )
          })}
      </Collapse>
    </List>
  )
}

export default ItemCard
