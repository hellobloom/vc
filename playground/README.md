# Attestations Playground

Issue, Claim, Request, and Share Credentials

## Running Locally

### Prerequisites

- RabbitMQ

```
brew install rabbitmq
export PATH=$PATH:/usr/local/opt/rabbitmq/sbin
```

- PostgreSQL DB named `attestations-playground-dev`

```
brew install postgresql@11
brew services run postgresql@11

createdb attestations-playground-dev
```

### Install

```
npm i -g lerna
npm i
lerna bootstrap
```

### Setup Environment

```
cd server
cp .env.sample .env
```

### Run

```
./bin/reset-dev
./bin/dev
```
