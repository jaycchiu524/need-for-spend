import React, { useEffect } from 'react'
import { usePlaidLink, PlaidLinkOptions } from 'react-plaid-link'

import { useMutation } from '@tanstack/react-query'

import { exchangeAccessToken } from '@/api/plaid-tokens'

import useLink from '@/hooks/useLink'
import useItems from '@/hooks/useItems'

interface Props {
  linkToken: string
  userId: string | null
  itemId: string | null
  children?: React.ReactNode
}

const LaunchLink = ({ userId, linkToken, itemId, children }: Props) => {
  const { mutateAsync: requestAccessToken } = useMutation({
    mutationKey: ['exchange-access-token'],
    mutationFn: exchangeAccessToken,
  })
  const { generateLinkToken, deleteLinkToken } = useLink()
  const { fetchItemById, fetchItemsByUser } = useItems({ userId, itemId })

  // The usePlaidLink hook manages Plaid Link creation
  // It does not return a destroy function;
  // instead, on unmount it automatically destroys the Link instance
  const config: PlaidLinkOptions = {
    onSuccess: async (public_token, metadata) => {
      const { institution, accounts } = metadata

      if (itemId != null) {
        // update mode: no need to exchange public token
        // await setItemState(props.itemId, 'good');

        // Fetch item by id
        const itemById = await fetchItemById(itemId)

        if (!itemById) {
          console.error('itemById?.data is null')
          return
        }

        // Delete link token
        deleteLinkToken(null, itemId)

        // regular link mode: exchange public token for access token
      } else {
        // call to Plaid api endpoint: /item/public_token/exchange in order to obtain access_token which is then stored with the created item
        await requestAccessToken({
          publicToken: public_token,
          institutionId: institution?.institution_id || '',
          institutionName: institution?.name || '',
          accounts,
        })

        if (!userId) return
        const itemsByUser = await fetchItemsByUser(userId)

        if (!itemsByUser) {
          console.error('itemsByUser?.data is null')
          return
        }
      }
      //     resetError();
      deleteLinkToken(userId, null)
      //     history.push(`/user/${props.userId}`);
    },
    onExit: async (error, metadata) => {
      // log and save error and metatdata
      // logExit(error, metadata, props.userId)
      if (error != null && error.error_code === 'INVALID_LINK_TOKEN') {
        await generateLinkToken(userId, itemId)
      }
      if (error != null) {
        // setError(error.error_code, error.display_message || error.error_message)
        console.error('error.error_code', error)
      }
      // to handle other error codes, see https://plaid.com/docs/errors/
    },
    onEvent: (eventName, metadata) => {
      // log and save event and metadata
      // logEvent(eventName, metadata, props.userId)
      console.log(eventName, metadata)
    },
    token: linkToken,
    //required for OAuth; if not using OAuth, set to null or omit:
    // receivedRedirectUri: window.location.href,
  }

  const { open, ready } = usePlaidLink(config)

  useEffect(() => {
    if (ready) {
      open()
    }
  }, [linkToken, itemId, open, ready])

  return <></>
}

export default LaunchLink
