# Dockerfile for building next.js client
FROM node:18.9.0-alpine AS base

ARG NEXT_PUBLIC_API_URL

# ## Build stage
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
ENV NODE_ENV=$NODE_ENV
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV NO_UPDATE_NOTIFIER=true

# First install dependencies (as they change less often)
# Copy .yarn folder for yarn version consistency
COPY .yarn ./.yarn
COPY .yarnrc.yml ./
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn workspace client install
RUN yarn cache clean

# Build the project and its dependencies
COPY tsconfig.json ./
COPY --from=builder /app/out/full/ .
COPY turbo.json ./

# Generate Prisma Client after copying the schema
RUN yarn workspace client build

## Run dev stage
# FROM installer AS dev
# WORKDIR /app
# ENV NODE_ENV=development
# CMD ["yarn", "workspace", "client", "dev"]

## Run prod stage
FROM base AS prod
WORKDIR /app

RUN apk add --no-cache dumb-init bash

ENV NODE_ENV=production

# Don't run production as root
# User "client" is not allowed to log in to the system using a shell.
RUN addgroup -g 1001 -S client
RUN adduser -u 1001 -S client -G client

# required for sed from env.sh to work in the docker container
RUN chown -R client:client /app

COPY --from=installer --chown=client:client /app/packages/client/.next/standalone ./

WORKDIR /app/packages/client
COPY --from=installer --chown=client:client /app/packages/client/public ./public
COPY --from=installer --chown=client:client /app/packages/client/.next/static ./.next/static

# RUN touch .env
# RUN chmod u+rwx .env

USER client

EXPOSE 3000

# use `dumb-init`, not `npm start` to make sure signals are passed properly and node don't run as pid 1
# cf https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/
# NOTE: this value will be overriden in Kubernetes, to set maxOldSpace value dynamically
CMD ["dumb-init", "node", "server.js"]