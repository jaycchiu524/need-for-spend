import express from 'express'

import * as winston from 'winston'
import * as expressWinston from 'express-winston'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'

import { Products, CountryCode } from 'plaid'

dotenv.config()

export const initExpress = () => {
  const app: express.Application = express()

  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(cors())
  app.use(helmet())

  const winstonOptions: expressWinston.LoggerOptions = {
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
      }),
    ],
    format: winston.format.combine(
      winston.format.json(),
      winston.format.prettyPrint(),
      winston.format.colorize({ all: true }),
    ),
  }

  app.use(expressWinston.logger(winstonOptions))

  if (!process.env.DEBUG) {
    winstonOptions.meta = false // when not debugging, log requests as one-liners
    if ('it' in global && typeof global.it === 'function') {
      winstonOptions.level = 'http' // disable logging for test runs
    }
  }

  return app
}

const normalizePort = (val: string) => {
  const port = parseInt(val, 10)
  // named pipe
  if (isNaN(port)) return val
  // port number
  if (port >= 0) return port
  return false
}

export const APP_PORT = process.env.TEST
  ? normalizePort('8081')
  : normalizePort(process.env.SERVER_PORT || '8080')
export const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID
export const PLAID_SECRET = process.env.PLAID_SECRET
export const PLAID_ENV = process.env.PLAID_ENV || 'sandbox'

// PLAID_PRODUCTS is a comma-separated list of products to use when initializing
// Link. Note that this list must contain 'assets' in order for the app to be
// able to create and retrieve asset reports.
export const PLAID_PRODUCTS = (
  process.env.PLAID_PRODUCTS || Products.Transactions
).split(',') as Products[]

// PLAID_COUNTRY_CODES is a comma-separated list of countries for which users
// will be able to select institutions from.
export const PLAID_COUNTRY_CODES = (
  process.env.PLAID_COUNTRY_CODES || 'US'
).split(',') as CountryCode[]

// Parameters used for the OAuth redirect Link flow.
//
// Set PLAID_REDIRECT_URI to 'http://localhost:3000'
// The OAuth redirect flow requires an endpoint on the developer's website
// that the bank website should redirect to. You will need to configure
// this redirect URI for your client ID through the Plaid developer dashboard
// at https://dashboard.plaid.com/team/api.
export const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || ''

// Parameter used for OAuth in Android. This should be the package name of your app,
// e.g. com.plaid.linksample
export const PLAID_ANDROID_PACKAGE_NAME =
  process.env.PLAID_ANDROID_PACKAGE_NAME || ''
