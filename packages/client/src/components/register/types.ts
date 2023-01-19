export type RegisterInput = {
  email: string
  password: string
  cpassword: string
  firstName: string
  lastName: string
}

export type RegisterRequest = {
  email: string
  password: string
  firstName: string
  lastName: string
}

export type RegisterResponse = {
  message?: string
  error?: string
}
