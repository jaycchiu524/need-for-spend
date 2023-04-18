# Dockerfile for building next.js client
FROM node:18.9.0-alpine AS base

ARG NEXT_PUBLIC_API_URL

## Run dev stage
FROM base AS debug

RUN apk update
RUN apk add libc6-compat
RUN apk add --no-cache dumb-init bash

WORKDIR /app

ENV NODE_ENV=development
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_ENV=sandbox
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 -S client
RUN adduser -u 1001 -S client -G client

COPY .yarn ./.yarn
COPY .yarnrc.yml tsconfig.json package.json yarn.lock ./
COPY  ./packages/client/package.json ./packages/client/

RUN yarn workspace client install

COPY ./packages/client ./packages/client

CMD ["yarn", "workspace", "client", "dev"]

## Install dependencies stage
FROM base AS builder
RUN apk update
RUN apk add libc6-compat
WORKDIR /app
ENV NODE_ENV=$NODE_ENV
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV NO_UPDATE_NOTIFIER=true

# First install dependencies (as they change less often)
# Copy .yarn folder for yarn version consistency
COPY .yarn ./.yarn
COPY .yarnrc.yml tsconfig.json package.json yarn.lock ./
COPY  ./packages/client/package.json ./packages/client/

RUN yarn workspaces focus client --production
# RUN yarn cache clean

COPY ./packages/client/next.config.js ./packages/client/
COPY ./packages/client/tsconfig.json ./packages/client/
COPY ./packages/client/tsconfig.build.json ./packages/client/
COPY ./packages/client/tsconfig.build.json ./packages/client/
COPY ./packages/client/public ./packages/client/public
COPY ./packages/client/src ./packages/client/src

RUN yarn workspace client build

## Run prod stage
FROM base AS production
WORKDIR /app

RUN apk add --no-cache dumb-init bash

ENV NODE_ENV=production

# Don't run production as root
# User "client" is not allowed to log in to the system using a shell.
RUN addgroup -g 1001 -S client
RUN adduser -u 1001 -S client -G client

COPY --from=builder /app/packages/client/.next/standalone ./

# .next/standalone
# ├── node_modules
# ├── package.json
# └── packages
#   └── client
#       ├── .env
#       ├── .next
#       ├── package.json
#       └── server.js
WORKDIR /app/packages/client
COPY --from=builder /app/packages/client/public ./public
COPY --from=builder /app/packages/client/.next/static ./.next/static

USER client

EXPOSE 3000

# use `dumb-init`, not `npm start` to make sure signals are passed properly and node don't run as pid 1
# cf https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/
# NOTE: this value will be overriden in Kubernetes, to set maxOldSpace value dynamically
CMD ["dumb-init", "node", "server.js"]