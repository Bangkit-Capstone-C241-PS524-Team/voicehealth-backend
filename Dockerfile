FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY . .

RUN yarn build

ENV PORT=8080

CMD [ "yarn", "start:prod" ]

# Optional environment variable handling for clarity
ENV MYSQL_DATABASE=testing \
    MYSQL_USER=root \
    MYSQL_PASSWORD=root \
    MYSQL_HOST=34.101.198.21 \
    MYSQL_PORT=3306 \
    DATABASE_URL=mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@${MYSQL_HOST}:${MYSQL_PORT}/${MYSQL_DATABASE} \
    JWT_SECRET=secretKey \
    JWT_EXPIRES_IN=1h