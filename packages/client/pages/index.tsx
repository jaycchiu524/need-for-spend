import * as React from 'react'

import { usePlaidLink, PlaidLinkOptions } from 'react-plaid-link'

import styles from '../styles/Home.module.css'

export default function Home() {
  const [token, setToken] = React.useState<string | null>(null)
  // get a link_token from your API when component mounts
  React.useEffect(() => {
    const createLinkToken = async () => {
      const response = await fetch(
        'http://localhost:8000/plaid/create-link-token',
        {
          method: 'POST',
        },
      )
      const { link_token } = await response.json()
      setToken(link_token)
    }
    createLinkToken()
  }, [])
  // The usePlaidLink hook manages Plaid Link creation
  // It does not return a destroy function;
  // instead, on unmount it automatically destroys the Link instance
  const config: PlaidLinkOptions = {
    onSuccess: async (public_token, metadata) => {
      const response = await fetch(
        'http://localhost:8000/plaid/exchange-access-token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: `public_token=${public_token}`,
        },
      )

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
    <div className={styles.container}>
      <h1>Plaid Demo</h1>
      <button onClick={() => open()} disabled={!ready}>
        Connect a bank account
      </button>
    </div>
  )
}
