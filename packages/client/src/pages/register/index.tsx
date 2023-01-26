import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Person from '@mui/icons-material/Person'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Grid from '@mui/material/Grid'

import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'

import { useMutation } from '@tanstack/react-query'

import { AxiosError } from 'axios'

import Copyright from '@/components/Copyright'

import { NavLink } from '@/components/NavLink'

import { RegisterInput } from '@/components/register/types'
import { RegisterSchema } from '@/components/register/yup.schema'
import { registerRequest } from '@/components/register/hooks'
import { useAuthStore } from '@/store/store'
import { ErrorResponse } from '@/api/types'

function Register() {
  const router = useRouter()
  const setToken = useAuthStore((state) => state.setToken)

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<RegisterInput>({
    defaultValues: {
      email: '',
      password: '',
      cpassword: '',
      firstName: '',
      lastName: '',
    },
    mode: 'onChange',
    resolver: yupResolver(RegisterSchema),
  })

  const { mutateAsync } = useMutation(registerRequest, {
    onSuccess: (data) => {
      // reset()

      if (typeof window !== 'undefined') {
        // Perform localStorage action
        setToken(data.data)
        router.push('/main')
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      alert(error.response?.data.message)
    },
  })

  const submit = handleSubmit(async (data) => {
    const { cpassword, ...rest } = data
    try {
      await mutateAsync(rest)
    } catch (error) {
      return error
    }
  })

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <Person />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box component="form" onSubmit={submit} noValidate sx={{ mt: 1 }}>
          <TextField
            {...register('email', { required: true })}
            margin="normal"
            required
            fullWidth
            label="Email"
            autoComplete="email"
            autoFocus
            inputProps={{
              'data-testid': 'email',
            }}
          />
          <TextField
            {...register('password', { required: true })}
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            inputProps={{
              'data-testid': 'password',
            }}
            autoComplete="new-password"
          />
          <TextField
            {...register('cpassword', { required: true })}
            margin="normal"
            required
            fullWidth
            label="Confirm Password"
            type="password"
            inputProps={{
              'data-testid': 'cpassword',
            }}
            autoComplete="new-password"
          />
          <TextField
            {...register('firstName', { required: true })}
            margin="normal"
            required
            fullWidth
            label="First Name"
            type="text"
            inputProps={{
              'data-testid': 'firstName',
            }}
          />
          <TextField
            {...register('lastName', { required: true })}
            margin="normal"
            required
            fullWidth
            label="Last Name"
            type="text"
            inputProps={{
              'data-testid': 'lastName',
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}>
            Sign Up
          </Button>
          {errors.email && (
            <Alert severity="error">
              <AlertTitle data-testid="email-error">
                {errors.email.message}
              </AlertTitle>
            </Alert>
          )}
          {errors.password && (
            <Alert severity="error">
              <AlertTitle data-testid="password-error">
                {errors.password.message}
              </AlertTitle>
            </Alert>
          )}
          {errors.cpassword && (
            <Alert severity="error">
              <AlertTitle data-testid="cpassword-error">
                {errors.cpassword.message}
              </AlertTitle>
            </Alert>
          )}
          {errors.firstName && (
            <Alert severity="error">
              <AlertTitle data-testid="cpassword-error">
                {errors.firstName.message}
              </AlertTitle>
            </Alert>
          )}
          {errors.lastName && (
            <Alert severity="error">
              <AlertTitle data-testid="cpassword-error">
                {errors.lastName.message}
              </AlertTitle>
            </Alert>
          )}
        </Box>
      </Box>
      <Grid container>
        <Grid item>
          <NavLink href="/login">
            <Typography variant="body2" color="text.secondary" align="center">
              {'Already have an account? Sign In'}
            </Typography>
          </NavLink>
        </Grid>
      </Grid>

      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  )
}

export default Register
