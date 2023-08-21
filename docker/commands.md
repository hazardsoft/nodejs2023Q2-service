# Docker

## Docker images: build

```sh
Rest API:
docker build --tag hazardsoft/library-rest-api --file docker/rest/Dockerfile .

PostgreSQL:
docker build --tag hazardsoft/library-database --file docker/db/Dockerfile .
```

## Docker images: run

```sh
Rest API:
docker run --publish 4000:4000 -d hazardsoft/library-rest-api

PostgreSQL:
docker run --publish 5432:5432 -d hazardsoft/library-database
```

## Docker images: publish

```sh
Rest API:
docker push hazardsoft/library-rest-api

PostgreSQL:
docker push hazardsoft/library-database
```
