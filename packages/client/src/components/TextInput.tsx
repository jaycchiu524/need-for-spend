import { TextField, TextFieldProps } from '@mui/material'
import { forwardRef } from 'react'

export const TextInput = forwardRef<HTMLInputElement, TextFieldProps>(
  (props, ref) => {
    return <TextField {...props} inputRef={ref} variant="outlined" />
  },
)
