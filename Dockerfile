FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

ENV PORT=8080

CMD [ "sh", "-c", "yarn db:generate && yarn start:prod" ]