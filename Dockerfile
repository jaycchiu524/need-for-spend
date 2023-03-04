FROM node:16.13.1-alpine3.15 AS builder

WORKDIR /app

COPY . .
RUN yarn install

CMD ["yarn","workspace", "server", "start"]


