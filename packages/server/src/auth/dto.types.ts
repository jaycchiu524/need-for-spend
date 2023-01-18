export type LoginRequest = {
  email: string
  password: string
}

export type VerifiedRequest = {
  id: string
  email: string
  role: string // admin | user
  refreshKey?: Buffer
  refreshToken?: string
}

export type JWT = VerifiedRequest & {
  refreshKey: Buffer
}
