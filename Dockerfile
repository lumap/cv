FROM oven/bun:latest

WORKDIR /usr/app

COPY package.json .
COPY bun.lockb ./
COPY src ./
COPY .env ./

RUN bun install 