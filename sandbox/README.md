# VC Sandbox

Issue, Claim, Request, and Share Credentials

## Running Locally

### Prerequisites

- RabbitMQ

```
brew install rabbitmq
export PATH=$PATH:/usr/local/opt/rabbitmq/sbin
```

- PostgreSQL DB named `vc-sandbox-dev`

```
brew install postgresql@11
brew services run postgresql@11

createdb vc-sandbox-dev
```

### Install

```
npm i -g lerna
npm i
lerna bootstrap
```

### Sandbox Setup

```
cd sandbox
npm i
```

### Setup Environment

```
cd server
cp .env.sample .env
cd ../
```

### Run

```
npm run reset-dev
npm run dev
```
