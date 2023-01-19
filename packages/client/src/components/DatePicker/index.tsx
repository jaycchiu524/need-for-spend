import * as React from 'react'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { Controller, useFormContext } from 'react-hook-form'
import dynamic from 'next/dynamic'

const DatePicker = ({ name, label }: { name: string; label: string }) => {
  const { control } = useFormContext()

  const DynamicPicker = dynamic(
    () =>
      import('@mui/x-date-pickers/DesktopDatePicker').then(
        (mod) => mod.DesktopDatePicker,
      ),
    {
      ssr: false,
    },
  )

  return (
    <Controller
      name={name || 'startDate'}
      control={control}
      render={({ field: { onChange, value } }) => (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack spacing={3}>
            <DynamicPicker
              label={label || 'Date'}
              inputFormat="MM/dd/yyyy"
              value={value}
              onChange={onChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </Stack>
        </LocalizationProvider>
      )}
    />
  )
}

export default DatePicker
