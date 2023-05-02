import express from 'express'

import * as winston from 'winston'
import * as expressWinston from 'express-winston'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'

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
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
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
