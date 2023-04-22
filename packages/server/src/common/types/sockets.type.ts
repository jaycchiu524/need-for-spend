import { Server } from 'socket.io'

export enum TransactionWebhookEvents {
  // Server to client
  SYNC_UPDATES_AVAILABLE = 'SYNC_UPDATES_AVAILABLE',
  // {
  //   "webhook_type": "TRANSACTIONS",
  //   "webhook_code": "SYNC_UPDATES_AVAILABLE",
  //   "item_id": "wz666MBjYWTp2PDzzggYhM6oWWmBb",
  //   "initial_update_complete": true,
  //   "historical_update_complete": false,
  //   "environment": "production"
  // }

  // For backwards compatibility
  INITIAL_UPDATE = 'INITIAL_UPDATE',
  HISTORICAL_UPDATE = 'HISTORICAL_UPDATE',
  DEFAULT_UPDATE = 'DEFAULT_UPDATE',
  TRANSACTIONS_REMOVED = 'TRANSACTIONS_REMOVED',
}

export enum ItemWebhookEvents {
  ERROR = 'ERROR',
  // {
  //   "webhook_type": "ITEM",
  //   "webhook_code": "ERROR",
  //   "item_id": "wz666MBjYWTp2PDzzggYhM6oWWmBb",
  //   "error": {
  //     "display_message": null,
  //     "error_code": "ITEM_LOGIN_REQUIRED",
  //     "error_message": "the login details of this item have changed (credentials, MFA, or required user action) and a user login is required to update this information. use Link's update mode to restore the item to a good state",
  //     "error_type": "ITEM_ERROR",
  //     "status": 400
  //   },
  //   "environment": "production"
  // }
  NEW_ACCOUNTS_AVAILABLE = 'NEW_ACCOUNTS_AVAILABLE',
  // {
  //   "webhook_type": "ITEM",
  //   "webhook_code": "NEW_ACCOUNTS_AVAILABLE",
  //   "item_id": "gAXlMgVEw5uEGoQnnXZ6tn9E7Mn3LBc4PJVKZ",
  //   "error": null,
  //   "environment": "production"
  // }
  PENDING_EXPIRATION = 'PENDING_EXPIRATION',
  // {
  //   "webhook_type": "ITEM",
  //   "webhook_code": "PENDING_EXPIRATION",
  //   "item_id": "wz666MBjYWTp2PDzzggYhM6oWWmBb",
  //   "consent_expiration_time": "2020-01-15T13:25:17.766Z",
  //   "environment": "production"
  // }
  USER_PERMISSION_REVOKED = 'USER_PERMISSION_REVOKED',
  // {
  //   "webhook_type": "ITEM",
  //   "webhook_code": "USER_PERMISSION_REVOKED",
  //   "error": {
  //     "error_code": "USER_PERMISSION_REVOKED",
  //     "error_message": "the holder of this account has revoked their permission for your application to access it",
  //     "error_type": "ITEM_ERROR",
  //     "status": 400
  //   },
  //   "item_id": "gAXlMgVEw5uEGoQnnXZ6tn9E7Mn3LBc4PJVKZ",
  //   "environment": "production"
  // }
  WEBHOOK_UPDATE_ACKNOWLEDGED = 'WEBHOOK_UPDATE_ACKNOWLEDGED',
  // {
  //   "webhook_type": "ITEM",
  //   "webhook_code": "WEBHOOK_UPDATE_ACKNOWLEDGED",
  //   "item_id": "wz666MBjYWTp2PDzzggYhM6oWWmBb",
  //   "error": null,
  //   "new_webhook_url": "https://plaid.com/example/webhook",
  //   "environment": "production"
  // }
}

export interface ServerToClientEvents {
  SYNC_UPDATES_AVAILABLE: (plaidItemId: string) => void
}

export interface ClientToServerEvents {
  hello: () => void
}

export interface InterServerEvents {
  ping: () => void
}

// Custom socket data
export interface SocketData {
  username: string
}

export type SocketIOServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>
