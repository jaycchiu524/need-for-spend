import React, { ReactNode, useEffect } from 'react'

import { usePlaidLink, PlaidLinkOptions } from 'react-plaid-link'

import { useMutation } from '@tanstack/react-query'

import MainLayout from '@/components/main/MainLayout'
import { createLinkToken, exchangeAccessToken } from '@/components/Plaid/api'

function PlaidHome() {
  // get a link_token from your API when component mounts
  const { data: linkToken, mutateAsync: requestLinkToken } = useMutation({
    mutationKey: ['create-link-token'],
    mutationFn: createLinkToken,
  })

  const { data: item, mutateAsync: requestAccessToken } = useMutation({
    mutationKey: ['exchange-access-token'],
    mutationFn: exchangeAccessToken,
  })

  const token = linkToken?.data.link_token || null

  useEffect(() => {
    requestLinkToken()
  }, [])

  // The usePlaidLink hook manages Plaid Link creation
  // It does not return a destroy function;
  // instead, on unmount it automatically destroys the Link instance
  const config: PlaidLinkOptions = {
    onSuccess: async (public_token, metadata) => {
      const { institution, accounts } = metadata

      const response = await requestAccessToken({
        publicToken: public_token,
        institutionId: institution?.institution_id || '',
        institutionName: institution?.name || '',
        accounts,
      })

      console.log(response)
    },
    onExit: (err, metadata) => {},
    onEvent: (eventName, metadata) => {},
    token,
    //required for OAuth; if not using OAuth, set to null or omit:
    // receivedRedirectUri: window.location.href,
  }

  const { open, exit, ready } = usePlaidLink(config)

  return (
    <div>
      <h1>Plaid Demo</h1>
      <button onClick={() => open()} disabled={!ready}>
        Connect a bank account
      </button>

      <pre>
        <code>{JSON.stringify(linkToken, null, 2)}</code>
      </pre>

      <pre>
        <code>{JSON.stringify(item, null, 2)}</code>
      </pre>
    </div>
  )
}

PlaidHome.getLayout = (page: ReactNode) => <MainLayout>{page}</MainLayout>

export default PlaidHome
