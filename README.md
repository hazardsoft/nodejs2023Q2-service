# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/hazardsoft/nodejs2023Q2-service
git checkout develop
```

## Installing NPM modules

```
npm install
```

## Create .env config

Copy/paste `.env.example` and rename it to `.env` (`PORT` env variable is considered only at the moment)
Part of env variables are passed to `docker-compose.yml`:

```
# PostgreSQL configuration for "database-service" service:
POSTGRES_USER=username
POSTGRES_PASSWORD=123456
POSTGRES_DB=library
PGDATA=/var/lib/postgresql/data
PRISMA_MIGRATION=20230729185908_init

# PostgreSQL configuration for "rest-api-service" service:
DATABASE_URL=postgresql://username:123456@database-service:5432/library?schema=public
```

where `PRISMA_MIGRATION` is a folder name containing latest Prisma migration, e.g. `20230729185908_init` in `./prisma/migrations/20230729185908_init`. PostgreSQL executes `migration.sql` upon database start (creates db tables with relations).

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

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging

## Database

PostgreSQL is used for persistence, Prisma ORM is used to communicate with PostgreSQL.

### Init

In order to create empty `Favorites` entity seeding is used. One can take a look at `package.json:prisma.seed` command to see that `prisma/seed.ts` script is executed.

```sh
npx prisma db seed
```

## Docker

### Run

Docker Compose is used to start application (both REST API and PostgreSQL will be started).
REST API can be accessed from local machine as rest api port is published (`PORT` environment variable defined in `.env` file will be used).
PostgreSQL can be accessed from local machine as database port is published (`POSTGRES_PORT` environment variable defined in `.env` file will be used).

```sh
docker compose up -d
```

### Stop

```sh
docker compose stop
```

### Vulnerabilities Check

[Snyk](https://snyk.io) is used for vulnerabilities verification.
Before running npm scripts please make sure to authenticate with Snyk APIs first (e.g. via GitHub):

```
snyk auth
```

To run security checks use the following NPM scripts:
```
npm run docker:vuln:rest
npm run docker:vuln:db
```

### Logs

```sh
Logs from all services:
docker compose logs -f

Logs from rest-api-service:
docker compose logs -f rest-api-service

Logs from database-service:
docker compose logs -f database-service
```
