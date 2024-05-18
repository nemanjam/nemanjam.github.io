# Dockerfile from Astro docs

# alpine is fine
# node:22.1.0-bookworm, node:20.13.1-slim, node:20.13.1-alpine
ARG NODE_IMAGE=node:20.13.1-alpine

FROM ${NODE_IMAGE} AS base
WORKDIR /app

# for alpine
RUN apk add --no-cache git

FROM base AS build
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# override sharp 0.32.6 with 0.33.3
# RUN yarn remove sharp
# RUN yarn add --arch=arm64 --platform=linux --libc=musl --ignore-engines sharp@0.33.3

COPY . .

# build time only env var
ARG ARG_SITE_URL
ENV SITE_URL=$ARG_SITE_URL
RUN echo "SITE_URL=$SITE_URL"

RUN yarn build

FROM nginx:stable-alpine3.17-slim AS runtime
COPY ./docker/nginx.conf /etc/nginx/nginx.conf

# sufficient for SSG
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080

