import { SandboxItemFireWebhookRequestWebhookCodeEnum } from 'plaid'

import { plaid } from '../plaid'

// Fire a DEFAULT_UPDATE webhook for an Item
export const fireWebhook = async (
  access_token: string,
  code?: SandboxItemFireWebhookRequestWebhookCodeEnum,
) => {
  const response = await plaid.sandboxItemFireWebhook({
    access_token: access_token,
    webhook_code:
      code || SandboxItemFireWebhookRequestWebhookCodeEnum.SyncUpdatesAvailable,
  })

  return response.data
}
