import axios from 'axios'

/**
 * Axios base configuration without auth headers
 */

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: axios.defaults.headers.common,
})
