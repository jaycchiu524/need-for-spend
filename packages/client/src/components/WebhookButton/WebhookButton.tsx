import { Button } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import React from 'react'

import { fireSandboxWebhook } from '@/api/webhook'

const WebhookButton = ({ itemId }: { itemId: string }) => {
  const { mutateAsync } = useMutation({
    mutationKey: ['sandbox-webhook', itemId],
    mutationFn: fireSandboxWebhook,
  })
  return (
    <Button
      sx={{ margin: 1 }}
      variant="outlined"
      onClick={() => mutateAsync(itemId)}>
      Simulate Webhook
    </Button>
  )
}

export default WebhookButton
