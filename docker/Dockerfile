# Dockerfile from Astro docs

# cant use alpine for sharp images on arm
# dark thumbnails on both slim (doesn't have git) and bookworm (has git)
# ARG NODE_IMAGE=node:22.1.0-bookworm
# ARG NODE_IMAGE=node:22.1.0-slim
ARG NODE_IMAGE=node:20.13.1-slim

FROM ${NODE_IMAGE} AS base
WORKDIR /app

# install git on slim
RUN apt-get update && apt-get install -y \
    ca-certificates \
    git \
    && rm -rf /var/lib/apt/lists/*

FROM base AS build
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# handle sharp
RUN yarn why sharp
RUN yarn remove sharp
RUN yarn add --arch=arm64 --platform=linux --libc=musl --ignore-engines sharp
RUN yarn why sharp

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

