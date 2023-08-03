FROM node:18-alpine as build-stage
WORKDIR /app
COPY ["package.json", "package-lock.json", "./"]
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
# uncomment line below in order to build prod-ready image w/o dev dependencies
# RUN npm ci --only=production

# FROM gcr.io/distroless/nodejs18-debian11 as run-stage
FROM node:18-alpine as run-stage
WORKDIR /app
COPY --from=build-stage ["app/dist/", "./dist/"]
COPY --from=build-stage ["app/node_modules/", "./node_modules/"]
COPY --from=build-stage ["app/package.json", "app/package-lock.json", "./"]
COPY --from=build-stage ["app/tsconfig.build.json", "./"]
COPY --from=build-stage ["app/prisma/seed.ts", "./prisma/"]
COPY --from=build-stage ["app/doc/api.yaml", "./doc/"]
EXPOSE 4000/tcp
CMD ["dist/main.js"]