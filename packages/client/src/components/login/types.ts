export type LoginInput = LoginRequest & {
  remember: boolean
}

export type LoginRequest = {
  email: string
  password: string
}

export type LoginSuccessResponse = {
  id: string
  accessToken: string
  refreshToken: string
  exp: number
}
