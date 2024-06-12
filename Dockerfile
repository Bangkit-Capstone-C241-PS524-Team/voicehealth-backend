FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

ENV PORT=8080

ENV JWT_SECRET="secretKey"
ENV JWT_EXPIRES_IN="1h"

CMD [ "sh", "-c", "yarn db:generate && yarn start:prod" ]