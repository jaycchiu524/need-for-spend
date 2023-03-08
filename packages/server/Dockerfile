# Reference: https://github.com/vercel/turbo/blob/main/examples/with-docker/apps/api/Dockerfile
# TODO: Reduce image size - remove .yarn

FROM node:18.9.0-alpine AS base

## Build stage
FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
# Prune root & server workspace dependencies through turbo prune
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=server --docker

## Install dependencies stage
FROM base AS installer
WORKDIR /app
RUN apk add --no-cache libc6-compat
RUN apk update
ENV NODE_ENV=production

# First install dependencies (as they change less often)
# Copy .yarn folder for yarn version consistency
COPY .yarn ./.yarn
COPY .yarnrc.yml ./
COPY tsconfig.json ./
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn workspaces focus server --production
RUN yarn cache clean

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .

# Generate Prisma Client after copying the schema
RUN yarn workspace server build

# COPY turbo.json turbo.json
COPY turbo.json ./

## Run stage
FROM base AS runner
WORKDIR /app

RUN apk add --no-cache dumb-init bash

# Don't run production as root
# User "server" is not allowed to log in to the system using a shell.
RUN addgroup -g 1001 -S server
RUN adduser -u 1001 -S server -G server

COPY --from=installer /app .
RUN chmod +x ./packages/server/entrypoint.sh

WORKDIR /app/packages/server

USER server

ENTRYPOINT ["./entrypoint.sh"]
# use `dumb-init`, not `npm start` to make sure signals are passed properly and node don't run as pid 1
# cf https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/
# NOTE: this value will be overriden in Kubernetes, to set maxOldSpace value dynamically
CMD ["dumb-init", "yarn", "start"]


