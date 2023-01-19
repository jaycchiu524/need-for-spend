import * as React from 'react'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import List from '@mui/material/List'
import AddIcon from '@mui/icons-material/Add'
import PeopleIcon from '@mui/icons-material/People'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'

type Submodule = {
  title: string
  onClick: () => void
}

type Props = {
  open?: boolean
  config: {
    title: string
    submodules?: Submodule[]
    onClick: () => void
    icon?: React.ReactNode
  }
}

const MenuButton = ({ open = false, config }: Props) => {
  const { title, submodules, onClick } = config

  return (
    <>
      <ListItemButton onClick={onClick}>
        <ListItemIcon>{config.icon || <PeopleIcon />}</ListItemIcon>
        <ListItemText primary={title} />
        {submodules && (open ? <ExpandLess /> : <ExpandMore />)}
      </ListItemButton>
      {submodules && submodules.length > 0 && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          {submodules.map((submodule) => (
            <List key={submodule.title} component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }} onClick={submodule.onClick}>
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary={submodule.title} />
              </ListItemButton>
            </List>
          ))}
        </Collapse>
      )}
    </>
  )
}

export default MenuButton
