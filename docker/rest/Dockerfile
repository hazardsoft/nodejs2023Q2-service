FROM node:18-alpine as build-stage
WORKDIR /app
COPY ["package.json", "package-lock.json", "./"]
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
RUN npm ci --only=production

FROM node:18-alpine as run-stage
WORKDIR /app
COPY --from=build-stage ["app/dist/", "./dist/"]
COPY --from=build-stage ["app/node_modules/", "./node_modules/"]
COPY --from=build-stage ["app/prisma/", "./prisma/"]
COPY --from=build-stage ["app/package.json", "app/package-lock.json", "./"]
COPY --from=build-stage ["app/tsconfig.json", "app/tsconfig.build.json", "./"]
EXPOSE 4000/tcp
CMD ["dist/main.js"]