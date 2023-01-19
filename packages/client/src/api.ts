import axios from 'axios'

/**
 * Handle all requests to the API
 *
 * @see "@/pages/_app.tsx" for the default authorization header
 */

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: 'application/json, text/plain, */*', // This is the default
    'Content-Type': 'application/json',
  },
})

export type ErrorResponse = {
  code: number
  message: string
}
