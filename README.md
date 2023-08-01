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

## Running application

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Generate Swagger Docs

If `NODE_ENV` is set to `development`, Swagger docs are generated and placed into `doc` folder replacing existing `api.yaml` file.

E.g. you can run the following command that uses `NODE_ENV=development` env variable:
```
npm run start:dev
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

```sh
npx prisma migrate dev --name init
```

### Model Change

```sh
prisma generate
```