FROM node:18-slim as build-stage
WORKDIR /app
COPY ["package.json", "package-lock.json", "./"]
RUN npm ci
COPY . .
RUN npm run build
RUN npm ci --only=production

FROM gcr.io/distroless/nodejs18-debian11 as run-stage
WORKDIR /app
COPY --from=build-stage ["app/dist/", "./dist/"]
COPY --from=build-stage ["app/node_modules/", "./node_modules/"]
EXPOSE 4000/tcp
CMD ["dist/main.js"]