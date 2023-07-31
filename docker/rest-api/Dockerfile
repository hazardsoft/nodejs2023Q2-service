FROM node:18-alpine
ENV NODE_ENV=development
WORKDIR /app
COPY ["package.json", "package-lock.json", "./"]
RUN npm ci
COPY ./ ./
EXPOSE 4000/tcp