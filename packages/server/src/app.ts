import express from 'express'
import * as http from 'http'

import * as winston from 'winston'
import * as expressWinston from 'express-winston'
import cors from 'cors'
import debug from 'debug'
import dotenv from 'dotenv'
import helmet from 'helmet'

dotenv.config()

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

const APP_PORT = process.env.APP_PORT || 8000
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID
const PLAID_SECRET = process.env.PLAID_SECRET
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox'

app.get('/', (req, res) => {
  res.send('Hello World!')
})
