<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).



# API Documentation

This API provides endpoints for user authentication, history management, and news retrieval. Below are the details of each endpoint available.

## Base URL
```
https://primeval-gear-426113-v6.et.r.appspot.com/api
```

## Authentication

### Register a New User

**Endpoint:** `POST /api/auth/register`

**Description:** Register a new user.

**Request Body:**
```json
{
    "username": "string",
    "password": "string",
    "email": "string"
}
```

**Response:**
- **201 Created:** User successfully registered.
- **400 Bad Request:** Validation error or user already exists.

### Login

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate a user.

**Request Body:**
```json
{
    "username": "string",
    "password": "string"
}
```

**Response:**
- **200 OK:** Successful login with a token.
- **401 Unauthorized:** Incorrect username or password.

### Send Verification Email

**Endpoint:** `POST /api/auth/send-verification`

**Description:** Send a verification email to the user.

**Request Body:**
```json
{
    "email": "string"
}
```

**Response:**
- **200 OK:** Verification email sent.
- **400 Bad Request:** Validation error or email not found.

### Verify Email

**Endpoint:** `GET /api/auth/verification`

**Description:** Verify a user's email.

**Request Parameters:**
- **token** (required): The verification token received in the email.

**Response:**
- **200 OK:** Email successfully verified.
- **400 Bad Request:** Invalid or expired token.

## History

### Get User History

**Endpoint:** `GET /api/history`

**Description:** Retrieve the history of the authenticated user.

**Request Headers:**
- **Authorization:** Bearer {token}

**Response:**
- **200 OK:** List of history items.
- **401 Unauthorized:** Invalid or missing token.

### Add History Item

**Endpoint:** `POST /api/history`

**Description:** Add a new item to the user's history.

**Request Headers:**
- **Authorization:** Bearer {token}

**Request Body:**
```json
{
    "item": "string"
}
```

**Response:**
- **201 Created:** History item successfully added.
- **400 Bad Request:** Validation error.
- **401 Unauthorized:** Invalid or missing token.

### Delete History Item

**Endpoint:** `DELETE /api/history`

**Description:** Delete an item from the user's history.

**Request Headers:**
- **Authorization:** Bearer {token}

**Request Body:**
```json
{
    "item_id": "string"
}
```

**Response:**
- **200 OK:** History item successfully deleted.
- **400 Bad Request:** Validation error.
- **401 Unauthorized:** Invalid or missing token.

## News

### Get News

**Endpoint:** `GET /api/news`

**Description:** Retrieve the latest news.

**Response:**
- **200 OK:** List of news articles.
- **500 Internal Server Error:** Server error or news service unavailable.