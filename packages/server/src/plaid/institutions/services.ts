import { plaid, PLAID_COUNTRY_CODES } from '@/plaid/plaid'

const getInstiutionById = async (institutionId: string | undefined) => {
  if (!institutionId) {
    return null
  }

  const {
    data: { institution },
  } = await plaid.institutionsGetById({
    institution_id: institutionId,
    country_codes: PLAID_COUNTRY_CODES,
    options: {
      include_optional_metadata: true,
    },
  })

  return institution
}

export const institutionsServices = {
  getInstiutionById,
}
