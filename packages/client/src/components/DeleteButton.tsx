import { IconButton, Tooltip } from '@mui/material'
import React from 'react'

import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

type Props = {
  tooltipTitle: string
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const DeleteButton = (props: Props) => {
  return (
    <Tooltip title={props.tooltipTitle}>
      <IconButton size="small" onClick={props.onClick} color="error">
        <DeleteForeverIcon />
      </IconButton>
    </Tooltip>
  )
}

export default DeleteButton
