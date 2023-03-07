# Dockerfile for building next.js client

FROM node:18.9.0-alpine AS base

## Build stage
FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
# Prune root & client workspace dependencies through turbo prune
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=client --docker

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
RUN yarn workspace client install
RUN yarn cache clean

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .

# Generate Prisma Client after copying the schema
RUN yarn workspace client build

# COPY turbo.json turbo.json
COPY turbo.json ./

## Run stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Don't run production as root
# User "client" is not allowed to log in to the system using a shell.
RUN addgroup -g 1001 -S client
RUN adduser -u 1001 -S client -G client
USER client
COPY --from=installer /app/packages/client/public ./public

COPY --from=installer --chown=client:client /app/packages/client/.next/standalone ./
COPY --from=installer --chown=client:client /app/packages/client/.next/static ./node_modules/.next/static

CMD ["node", "packages/client/server.js"]