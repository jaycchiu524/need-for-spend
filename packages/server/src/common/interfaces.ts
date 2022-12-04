import express from 'express'

export type CommonRoutes = (app: express.Application) => express.Application

export interface InfoResponse {
  item_id: string
  access_token: string
  products: string[]
}
