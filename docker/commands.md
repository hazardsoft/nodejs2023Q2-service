# Docker

## Docker images: build
```sh
Rest API:
docker build --tag rest-api --file docker/rest-api/Dockerfile .

PostgreSQL:
docker build --tag rest-database --file docker/database/Dockerfile .
```

## Docker images: run

```sh
Rest API:
docker run --publish 4000:4000 -d rest-api

PostgreSQL:
docker run --publish 5432:5432 -d rest-database 
```

## Docker images: publish

```sh
Rest API:
docker tag rest-api:latest hazardsoft/rest-api:latest
docker push hazardsoft/rest-api

PostgreSQL:
docker tag rest-database:latest hazardsoft/rest-database:latest
docker push hazardsoft/rest-database
```

## Docker images: security

```sh
docker scout quickview
```

## Docker Compose

### Run

```sh
docker compose up -d
```

### Stop

```sh
docker compose stop
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