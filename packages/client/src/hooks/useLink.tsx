import { useMutation } from '@tanstack/react-query'

import { AxiosError } from 'axios'

import { createLinkToken } from '@/api/plaid-tokens'

import { useLinkTokenStore } from '@/store/link-token'

const useLink = () => {
  const {
    setUserLink,
    setItemLink,
    deleteLinkToken: deleteToken,
  } = useLinkTokenStore.getState()

  // create a link_token when:
  // 1. Create a new item (bank) -> userId
  // 2. Update an existing item (bank) -> itemId
  const { mutateAsync: requestLinkToken } = useMutation({
    mutationKey: ['create-link-token'],
    mutationFn: createLinkToken,
  })

  const generateLinkToken = async (
    userId: string | null,
    itemId: string | null,
  ) => {
    try {
      const response = await requestLinkToken({ userId, itemId })
      const token = response?.data?.link_token
      if (!token) {
        throw new Error('Error while fetching client token')
      }

      if (userId) {
        setUserLink({ userId, token })
      } else if (itemId) {
        setItemLink({ itemId, token })
      }

      return token
    } catch (err) {
      const e = err as AxiosError
      console.error(e.message, e.response?.data)
    }
  }

  const deleteLinkToken = (userId: string | null, itemId: string | null) => {
    deleteToken(userId, itemId)
  }

  return {
    generateLinkToken,
    deleteLinkToken,
  }
}

export default useLink
