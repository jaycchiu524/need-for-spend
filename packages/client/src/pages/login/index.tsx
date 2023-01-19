import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Grid from '@mui/material/Grid'

import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

import { useMutation } from '@tanstack/react-query'

import { AxiosError } from 'axios'

import { yupResolver } from '@hookform/resolvers/yup'

import Copyright from '@/components/Copyright'

import { NavLink } from '@/components/NavLink'

import { useAuthStore } from '@/store/store'

import { LoginFailResponse, LoginInput } from '@/components/login/types'

import { LoginSchema } from '@/components/login/yup.schema'

import { loginRequest } from '@/components/login/hooks'

function Login() {
  const [invalid, setInvalid] = React.useState(false)

  const router = useRouter()
  const setToken = useAuthStore((state) => state.setToken)

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginInput>({
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
    mode: 'onChange',
    resolver: yupResolver(LoginSchema),
  })

  const { mutateAsync } = useMutation(loginRequest, {
    onSuccess: (data) => {
      const { data: token } = data
      if (typeof window !== 'undefined') {
        // Perform localStorage action
        setToken(token)
        router.push('/main')
      }
    },
    onError: (error: AxiosError<LoginFailResponse>) => {
      // console.log(error.response?.data.error)
      // alert(error.response?.data.error)
      setInvalid(true)
    },
  })

  const submit = handleSubmit(async (data) => {
    const { remember, ...req } = data

    try {
      await mutateAsync(req)
    } catch (error) {
      return error
    }
  })

  const auth = useAuthStore((state) => state.auth)

  React.useEffect(() => {
    if (auth.token && auth.expiresAt * 1000 > Date.now()) {
      router.push('/main')
    }
  }, [auth.expiresAt, auth.token, router])

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
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={submit} noValidate sx={{ mt: 1 }}>
          <TextField
            {...register('email', { required: true })}
            margin="normal"
            required
            fullWidth
            label="Email Address"
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
            id="password"
            autoComplete="current-password"
            inputProps={{
              'data-testid': 'password',
            }}
          />
          <FormControlLabel
            control={<Checkbox {...register('remember')} color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          {(invalid || errors.email || errors.password) && (
            <Alert severity="error">
              <AlertTitle>Invalid email or password</AlertTitle>
            </Alert>
          )}
        </Box>
      </Box>
      <Grid container>
        <Grid item>
          <NavLink href="/register">
            <Typography variant="body2" color="text.secondary" align="center">
              {"Don't have an account? Sign Up!"}
            </Typography>
          </NavLink>
        </Grid>
      </Grid>

      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  )
}

export default Login
