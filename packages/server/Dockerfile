# Reference: https://github.com/vercel/turbo/blob/main/examples/with-docker/apps/api/Dockerfile
# TODO: Reduce image size - remove .yarn

FROM node:18.9.0-alpine AS base

## Debug
FROM base AS debug
WORKDIR /app
RUN apk update
RUN apk add libc6-compat
RUN apk add --no-cache dumb-init bash

ENV NODE_ENV=development

COPY .yarn ./.yarn
COPY .yarnrc.yml tsconfig.json package.json yarn.lock ./
COPY ./packages/server/package.json ./packages/server/
RUN yarn workspace server install
COPY ./packages/server/ ./packages/server/

RUN addgroup -g 1001 -S server
RUN adduser -u 1001 -S server -G server

WORKDIR /app/packages/server
RUN if [ ! -d "logs" ]; then \
      mkdir logs && chown server:server logs;\
    fi
CMD ["dumb-init", "yarn", "dev"]

## Build stage
FROM base AS builder
WORKDIR /app
RUN apk update
RUN apk add libc6-compat
ENV NODE_ENV=production

# First install dependencies (as they change less often)
# Copy .yarn folder for yarn version consistency
COPY .yarn ./.yarn
COPY .yarnrc.yml tsconfig.json package.json yarn.lock ./
COPY ./packages/server/package.json ./packages/server/

RUN yarn workspaces focus server --production
RUN yarn cache clean

COPY ./packages/server/src ./packages/server/src
COPY ./packages/server/entrypoint.sh ./packages/server/
COPY ./packages/server/tsconfig.json ./packages/server/
COPY ./packages/server/tsconfig.build.json ./packages/server/
COPY ./packages/server/prisma ./packages/server/prisma
# Generate Prisma Client after copying the schema
RUN yarn workspace server build

## Prod
FROM base AS production
WORKDIR /app

RUN apk add --no-cache dumb-init bash

# Don't run production as root
# User "server" is not allowed to log in to the system using a shell.
RUN addgroup -g 1001 -S server
RUN adduser -u 1001 -S server -G server

RUN mkdir logs && chown server:server logs

COPY --from=builder /app/packages/server/dist ./
COPY --from=builder /app/packages/server/prisma/ ./prisma/
COPY --from=builder /app/packages/server/entrypoint.sh ./
COPY --from=builder /app/node_modules ./node_modules
RUN chmod +x ./entrypoint.sh

USER server

ENTRYPOINT ["./entrypoint.sh"]
# use `dumb-init`, not `npm start` to make sure signals are passed properly and node don't run as pid 1
# cf https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/
# NOTE: this value will be overriden in Kubernetes, to set maxOldSpace value dynamically
CMD ["dumb-init", "node", "./src/app.js"]


