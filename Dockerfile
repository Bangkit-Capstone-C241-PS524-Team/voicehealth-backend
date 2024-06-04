FROM node:18-alpine

WORKDIR /app

COPY . .

RUN yarn

RUN yarn build

EXPOSE 8080

CMD [ "yarn", "start:prod" ]