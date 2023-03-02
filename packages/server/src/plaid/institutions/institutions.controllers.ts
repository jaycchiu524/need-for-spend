import { Request, Response } from 'express'

import debug from 'debug'

import { JWT } from '@/auth/dto.types'

import { institutionsServices } from './services'

const log = debug('app: institution-controllers')

const getInstiutionById = async (
  req: Request<{ institutionId: string }, any, any, any>,
  res: Response<any, { jwt: JWT }>,
) => {
  const institutionId = req.params.institutionId

  log('getInstiutionById', institutionId)

  try {
    const institution = await institutionsServices.getInstiutionById(
      institutionId,
    )

    if (!institution) {
      return res.status(404).send({
        code: 404,
        message: 'Institution not found',
      })
    }

    return res.status(200).send(institution)
  } catch (err) {
    log(err)
    return res.status(500).send({
      code: 500,
      message: 'Internal server error',
    })
  }
}

export const institutionsControllers = {
  getInstiutionById,
}
