import { TextField, TextFieldProps } from '@mui/material'
import React from 'react'

type Props = {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>

// A debounced input react component
const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...inputProps
}: Props) => {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <TextField
      {...inputProps}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}
export default DebouncedInput
