# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/hazardsoft/nodejs2023Q2-service
git checkout docker
```

## Installing NPM modules

```
npm install
```

## Create .env config

Copy/paste `.env.example` and rename it to `.env` (`PORT` env variable is considered only at the moment)
Environment variables are passed to `docker-compose.yml/docker-compose-prod.yml`:

```
# Nest.js server port
PORT=4000

# PostgreSQL configuration for "database-service" service
POSTGRES_USER=hazardsoft
POSTGRES_PASSWORD=123456
POSTGRES_DB=library
POSTGRES_PORT=5432

# PostreSQL connection url used by "rest-api-service" service
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public
```

## Running application

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Generate Swagger Docs

If environment variable `GEN_DOCS=1` is set, Swagger docs are generated and placed into `doc` folder replacing existing `api.yaml` file.
E.g. you can run the following command that uses `GEN_DOCS=1` environment variable (can not be used inside of docker container):

```
npm run start:dev:docs
```

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

## Database

PostgreSQL is used for persistence, Prisma ORM is used to communicate with PostgreSQL.

### Init

In order to create empty `Favorites` entity seeding is used. One can take a look at `package.json:prisma.seed` command to see that `prisma/seed.ts` script is executed.

```sh
npx prisma db seed
```

## Docker

### Run

Docker Compose is used to start application (REST API application and PostgreSQL server will be started).
REST API can be accessed from local machine as rest api port is published (`PORT` environment variable defined in `.env` file will be used).
PostgreSQL can be accessed from local machine as database port is published in DEV mode only(`POSTGRES_PORT` environment variable defined in `.env` file will be used).

```sh
dev:
docker compose up --build --detach

prod:
docker compose -f docker-compose-prod.yml up --build --detach
docker compose -f docker-compose-prod.yml up --detach (in case you do not want to build docker images locally but want to pull them from Docker Hub instead)
```

### Stop

```sh
dev:
docker compose down

prod:
docker compose -f docker-compose-prod.yml down
```

### Failure Auto-restart

Rest API container auto restarts due to container failure if `docker-compose-prod.yml` is run (only!), it does not work when `docker-compose.yml` is used as in this case application is started in watch mode.

### Vulnerabilities Check

(Docker Scout)[https://docs.docker.com/scout/] is used to scan images for vulnerabilities

To run security checks use the following NPM scripts:

```
npm run vulns:rest
npm run vulns:db
```
