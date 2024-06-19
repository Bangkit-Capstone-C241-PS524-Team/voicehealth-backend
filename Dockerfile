FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

ENV DATABASE_URL="mysql://root:root@34.101.198.21:3306/testing"

RUN yarn db:migrate
RUN yarn db:generate

RUN yarn build

ENV PORT=8080

ENV JWT_SECRET="secretKey"
ENV JWT_EXPIRES_IN="1h"

CMD [ "sh", "-c", "yarn db:migrate && yarn db:seed && yarn db:generate && yarn db:seed && yarn start:prod" ]