import express from 'express'

export interface InfoResponse {
  item_id: string
  access_token: string
  products: string[]
}
