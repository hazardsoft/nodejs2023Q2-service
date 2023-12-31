# Home Library Service, Part 2 (Containerization, Docker and Database & ORM)

## Contents

1. [Run Application](./README.md#running-application)
2. [Perform Verifications](./README.md#verifications)

## Prerequisites

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download/) (use 18 LTS version)
- [Docker](https://docs.docker.com/engine/install/)

## Downloading

```
git clone https://github.com/hazardsoft/nodejs2023Q2-service
git checkout auth
```

## Running Application

1. [Install dependencies](./README.md#installing-dependencies)
2. [Create .env config](./README.md#creating-env-config)
3. [Run application with Docker](./README.md#running-application-with-docker)
4. [Run application w/o Docker (optionally)](./README.md#running-application-wo-docker-optional)

### Installing Dependencies

```
npm install
```

### Creating .env Config

Create 2 config files out of `.env.example` via copy/paste:
1. `.env` file to be used to local development (set `POSTGRES_HOST` variable to `localhost`);
2. `.env.docker` to be used by Docker (make sure that `POSTGRES_HOST` is set to `database-service`).

### Running Application with Docker

Docker Compose is used to run application (REST API application and PostgreSQL server will be started).
There are 2 modes of running application: development and production. 
Each mode has distinguishing features described below:

**N.B. Application can not be run in both mode simultaneously (in that case `port is already allocated` error can be seen in the console), if one mode already started and you want to start another one, please stop already running first.**

#### Development Mode

Development mode is used for local development specifically and has number of distinguising features:
1. dedicated [Dockerfile-dev](./docker/rest/Dockerfile-dev) file is used to build REST API image (includes dev dependencies from `package.json`)
2. `src` and `test` local folders are binded to the REST API container to enable watch mode and provide ability to run tests in the container;
3. REST API application port is exposed to `localhost` so it can be tested locally (e.g. via Postman or http://localhost/doc Swagger docs);
4. Logs are enabled for PostgreSQL server;
5. PostgreSQL data and logs are stored in dedicated docker volumes (so they can be checked even after containers are stopped/destroyed);
6. PostgreSQL server port is exposed to `localhost` so a UI client (e.g. DBeaver) can be used to explore DB data.

```sh
start:
docker compose --env-file .env.docker up --build --detach

stop:
docker compose down
```

#### Production Mode

Production mode is introduced for CI/CD use primarily and has number of distinguising features:
1. REST API service start depends on PostgreSQL service start after successful healthcheck only;
2. REST API and PostgreSQL both belong to the same custom network and use that network for communication: REST API is exposed to `localhost` while PostgreSQL not (can be accessed by REST API service only, no other container can communicate with PostgreSQL container);
3. REST API uses dedicated [Dockerfile](./docker/rest/Dockerfile) that does not include any dev dependencies from `package.json`;
4. No dedicated volumes are used to store data/logs;
5. None of local folders are bind mounted (dev watch and tests are not accessible).

```sh
start:
docker compose -f docker-compose-prod.yml --env-file .env.docker up --build --detach

stop:
docker compose -f docker-compose-prod.yml down
```

### Running Application w/o Docker (optional)

Normally application should be run with Docker Compose (refer to [Running Application with Docker](./README.md#running-application-with-docker)).

If you still need to run application/tests w/o Docker (e.g. for better debug experience), the following steps should be done:
1. run `docker compose --env-file .env.docker up database-service --build --detach` command - runs PostgreSQL service only
2. run `npx prisma migrate deploy` - applies prisma migrations to the database started in p.1
3. run `npx prisma generate` - generates Prisma Client
4. run `npx prisma db seed` - seeds database started in p.1
5. run `npm run start:dev` 
6. run `npm run test:auth`

## Verifications

1. [Run Tests](./README.md#run-tests)
2. [Application Logs](./README.md#application-logs)
3. [Custom Network](./README.md#custom-network)
4. [Application Auto Restart](./README.md#application-auto-restart)
5. [Database data/logs in Volumes](./README.md#database-datalogs-in-volumes)
6. [Docker Image Size](./README.md#docker-image-size)
7. [Vulnerabilities Check](./README.md#vulnerabilities-check)
8. [Docker Hub](./README.md#docker-hub)
9.  [Database Migrations](./README.md#database-migrations)
10. [ESLint/Prettier](./README.md#eslintprettier)

### Run Tests

Run application in development mode. 
**Please refer to [Development Mode](./README.md#development-mode) for more details**

Tests can be run either on host or in a container:
1. to run tests on host run command `npm run test:auth` in a terminal (as usual);
2. to run tests in the container :
   1. open `Terminal` tab of REST API container;
   2. run `npm run test:auth` command in the container's terminal (refer to the image below).
    ![Image displaying running tests in REST API container in development mode](images/tests-dev-mode.png)

### Application Logs

By default 2 logs files are created:
1. `./logs/combined.log` - contains logs with all levels (except of `error`);
2. `./logs/error.log` - contains logs with `error` log level only.

`.env.example` has several settings responsible for configuring logs:
1. `LOG_LEVEL` defines log levels (log levels naming and values fully correspond Nest ones); can be array of log levels (e.g. `LOG_LEVEL=log,error`) or contain one log level only (e.g. `LOG_LEVEL=debug`);
2. `LOG_TARGET` defines list of targets to write logs to; can be array of targets (e.g. `LOG_TARGET=stdout,file`) or contain one target only (e.g. `LOG_TARGET=file`);
3. `LOG_LIMIT` defines max log file size in kilobytes (e.g. `LOG_LIMIT=20`): once file size limit is reached current log file is closed and a new one is created;
4. `LOG_FOLDER` defines folder where all logs will be created.

If application is run in [Development Mode](./README.md#development-mode) docker volume `rest-logs` is created and stores all log files created by the application.

### Custom Network

Custom network is configured and used if application is run in production mode only!
**Please refer to [Production Mode](./README.md#production-mode) for more details.**

### Application Auto Restart

REST API application restarts if changes are introduced into files under `src` folder.
Log message `File change detected. Starting incremental compilation...` displays in a running docker container under `Logs` tab of Docker Desktop (refer to image below).
![Image displaying watch mode logs in REST API docker container](./images/dev-watch-mode.png)

Watch mode is used if application is run in development mode only!
**Please refer to [Development Mode](./README.md#development-mode) for more details**

### Database data/logs in Volumes

PostgreSQL data and logs are stored in corresponding volumes `pg-data` and `pg-logs` (refer to images below).
![Image displaying pg-data docker volume and its relation to postgres container](./images/pg-data.png)
![Image displaying pg-logs docker volume and its relation to postgres container](./images/pg-logs.png)

These volumes are created/used if application is run in development mode only!
**Please refer to [Development Mode](./README.md#development-mode) for more details**

### Docker Image Size

REST API is built into two different Docker images:
1. development (includes dev deps, built from [Dockerfile-dev](./docker/rest/Dockerfile-dev))
2. production (w/o dev deps, built from [Dockerfile](./docker/rest/Dockerfile), published to Docker Hub)
   
Both images are under 500mb due to use of multi-stage builds (refer to images below).
![Image displaying REST API docker image size for dev build](images/rest-api-image-dev.png)
![Image displaying REST API docker image size for prod build](images/rest-api-image-prod.png)

### Vulnerabilities Check

[Docker Scout](https://docs.docker.com/scout/) is used to scan images for vulnerabilities

To run security checks use the following NPM scripts:

```
npm run vulns:rest
npm run vulns:db
```

### Docker Hub

Both REST API and PostgreSQL docker images are published to Docker Hub (refer to image below):
1. [hazardsoft/library-rest-api](https://hub.docker.com/r/hazardsoft/library-rest-api)
2. [hazardsoft/library-database](https://hub.docker.com/r/hazardsoft/library-database)

![Image displaying REST API and PostgreSQL docker images published to Docker Hub](images/docker-hub.png)

### Database Migrations

[Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate) is used to apply migrations to a database and seeding right after REST API application starts (both in development and production modes).

The following commands are called when container starts:
1. `npx prisma migrate deploy` - Prisma applies migrations stored in `prisma/migrations` folder to a running database;
2. `npx prisma db seed` - Prisma runs `prisma:seed` command defined in `package.json` to create default `Favorite` entity.

### ESLint/Prettier

```
npm run lint
```

```
npm run format
```