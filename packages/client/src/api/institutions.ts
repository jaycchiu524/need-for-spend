import { AxiosError } from 'axios'

import { ErrorResponse, Institution } from '@/api/types'

import { fetcher } from '@/api/fetcher'

export type InstitutionType = Institution
type GetInstitutionByIdResponse = InstitutionType

export const getInstitutionById = async (institutionId: string) => {
  try {
    const api = await fetcher()
    if (!api) return
    const response = await api.get<GetInstitutionByIdResponse>(
      `/institutions/${institutionId}`,
    )
    return response
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>
    throw error
  }
}
