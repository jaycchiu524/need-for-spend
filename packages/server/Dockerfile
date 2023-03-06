# Reference: https://github.com/vercel/turbo/blob/main/examples/with-docker/apps/api/Dockerfile
# TODO: Reduce image size - remove .yarn

## Build stage
FROM node:16.13.1-alpine3.15 AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
# Prune root & server workspace dependencies through turbo prune
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=server --docker

## Install dependencies stage
FROM node:16.13.1-alpine3.15 AS installer
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

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .

# Generate Prisma Client after copying the schema
RUN yarn workspace server build

# COPY turbo.json turbo.json
COPY turbo.json ./

## Run stage
FROM node:16.13.1-alpine3.15 AS runner
WORKDIR /app

# Don't run production as root
# User "server" is not allowed to log in to the system using a shell.
RUN addgroup -g 1001 -S server
RUN adduser -u 1001 -S server -G server
USER server
COPY --from=installer /app .

# CMD ["tail","-f" , "/dev/null"]
CMD ["yarn", "ws", "start"]