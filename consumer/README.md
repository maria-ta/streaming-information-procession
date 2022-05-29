## Description

Streaming information procession homework (consumer app).

## Installation

You should have Docker installed and running on your PC. You should also have Node.js and npm installed.

```bash
$ docker compose up -d
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

After application start, open
* http://localhost:4000/index.html to see UI
* http://localhost:8080 to see Kafka UI

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
