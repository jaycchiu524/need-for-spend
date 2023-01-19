export type LoginInput = LoginRequest & {
  remember: boolean
}

export type LoginRequest = {
  email: string
  password: string
}

export type LoginSuccessResponse = {
  expiresAt: number
  token: string
}

export type LoginFailResponse = {
  error: string
}
