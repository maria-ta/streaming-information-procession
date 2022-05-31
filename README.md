[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

## Description

Streaming information procession homework.

## Installation

You should have Docker installed and running on your PC. You should also have Node.js and npm installed.

```bash
$ docker compose up -d
$ npm install
```
After that you should create a Kafka topic manually via Kafka Web UI: http://localhost:8080.

To create a topic go to http://localhost:8080/ui/clusters/local/topics, then click `Add topic` button and create a topic with name `analytics`.

## Running the app

```bash
$ npm run start
```

After application start, open
* http://localhost:3000/index.html to see UI
* http://localhost:3000/index.html to see Analytics UI
* http://localhost:8080 to see Kafka UI
