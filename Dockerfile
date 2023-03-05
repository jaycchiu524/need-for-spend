FROM node:16.13.1-alpine3.15 AS builder

WORKDIR /app

# Copy .yarn folder for yarn version consistency
COPY .yarn ./.yarn
# Copy yarn.lock & package.json & .yarnrc.yml for dependency installation
COPY package.json yarn.lock .yarnrc.yml ./
COPY ./packages/server/package.json ./packages/server/
COPY ./packages/client/package.json ./packages/client/
COPY ./packages/server/.yarnrc.yml ./packages/server/
# Install dependencies for all workspaces with frozen lockfile
RUN yarn install --immutable
# Copy all files
COPY . .

CMD ["yarn","workspace", "server" "start"]


