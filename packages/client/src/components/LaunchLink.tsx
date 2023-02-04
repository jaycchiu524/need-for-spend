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

  // const { refetch: refetchItemById } = useQuery({
  //   queryKey: ['itemById', itemId],
  //   queryFn: () => getItemById(itemId || ''),
  //   enabled: false,
  // })

  // const { refetch: refetchItemByUser } = useQuery({
  //   queryKey: ['itemByUserId', userId],
  //   queryFn: () => getItemsByUserId(itemId || ''),
  //   enabled: false,
  // })

  const { generateLinkToken, deleteLinkToken } = useLink()
  const { fetchItemById, fetchItemsByUser } = useItems({ userId, itemId })

  // const { appendItems } = useItemStore.getState()

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

// interface Props {
//   isOauth?: boolean;
//   token: string;
//   userId: number;
//   itemId?: number | null;
//   children?: React.ReactNode;
// }

// // Uses the usePlaidLink hook to manage the Plaid Link creation.  See https://github.com/plaid/react-plaid-link for full usage instructions.
// // The link token passed to usePlaidLink cannot be null.  It must be generated outside of this component.  In this sample app, the link token
// // is generated in the link context in client/src/services/link.js.

// export default function LaunchLink(props: Props) {
//   const history = useHistory();
//   const { getItemsByUser, getItemById } = useItems();
//   const { generateLinkToken, deleteLinkToken } = useLink();
//   const { setError, resetError } = useErrors();

//   // define onSuccess, onExit and onEvent functions as configs for Plaid Link creation
//   const onSuccess = async (
//     publicToken: string,
//     metadata: PlaidLinkOnSuccessMetadata
//   ) => {
//     // log and save metatdata
//     logSuccess(metadata, props.userId);
//     if (props.itemId != null) {
//       // update mode: no need to exchange public token
//       await setItemState(props.itemId, 'good');
//       deleteLinkToken(null, props.itemId);
//       getItemById(props.itemId, true);
//       // regular link mode: exchange public token for access token
//     } else {
//       // call to Plaid api endpoint: /item/public_token/exchange in order to obtain access_token which is then stored with the created item
//       await exchangeToken(
//         publicToken,
//         metadata.institution,
//         metadata.accounts,
//         props.userId
//       );
//       getItemsByUser(props.userId, true);
//     }
//     resetError();
//     deleteLinkToken(props.userId, null);
//     history.push(`/user/${props.userId}`);
//   };

//   const onExit = async (
//     error: PlaidLinkError | null,
//     metadata: PlaidLinkOnExitMetadata
//   ) => {
//     // log and save error and metatdata
//     logExit(error, metadata, props.userId);
//     if (error != null && error.error_code === 'INVALID_LINK_TOKEN') {
//       await generateLinkToken(props.userId, props.itemId);
//     }
//     if (error != null) {
//       setError(error.error_code, error.display_message || error.error_message);
//     }
//     // to handle other error codes, see https://plaid.com/docs/errors/
//   };

//   const onEvent = async (
//     eventName: PlaidLinkStableEvent | string,
//     metadata: PlaidLinkOnEventMetadata
//   ) => {
//     // handle errors in the event end-user does not exit with onExit function error enabled.
//     if (eventName === 'ERROR' && metadata.error_code != null) {
//       setError(metadata.error_code, ' ');
//     }
//     logEvent(eventName, metadata);
//   };

//   const config: PlaidLinkOptionsWithLinkToken = {
//     onSuccess,
//     onExit,
//     onEvent,
//     token: props.token,
//   };

//   if (props.isOauth) {
//     config.receivedRedirectUri = window.location.href; // add additional receivedRedirectUri config when handling an OAuth reidrect
//   }

//   const { open, ready } = usePlaidLink(config);

//   useEffect(() => {
//     // initiallizes Link automatically
//     if (props.isOauth && ready) {
//       open();
//     } else if (ready) {
//       // regular, non-OAuth case:
//       // set link token, userId and itemId in local storage for use if needed later by OAuth

//       localStorage.setItem(
//         'oauthConfig',
//         JSON.stringify({
//           userId: props.userId,
//           itemId: props.itemId,
//           token: props.token,
//         })
//       );
//       open();
//     }
//   }, [ready, open, props.isOauth, props.userId, props.itemId, props.token]);

//   return <></>;
// }
