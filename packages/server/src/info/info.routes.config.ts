import { CommonRoutes } from '@/common/interfaces'
import debug from 'debug'
import express from 'express'
import { infoController } from './info.controller'

const debugLog = debug('app: info-routes')

export const infoRoutes = (app: express.Application) => {
  const name = 'InfoRoutes'

  debugLog(`Initializing ${name}`)

  app.route(`/info`).get(infoController.getServerInfo)
  return app
}
