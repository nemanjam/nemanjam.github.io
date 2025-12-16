# Dockerfile from Astro docs

# alpine is fine
# node:22.1.0-bookworm, node:20.13.1-slim, node:20.13.1-alpine
ARG NODE_IMAGE=node:24.7.0-alpine3.22

# -------------- base --------------

FROM --platform=$BUILDPLATFORM ${NODE_IMAGE} AS base
WORKDIR /app

# for alpine
RUN apk add --no-cache git

# installs pnpm correctly
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
RUN corepack prepare pnpm@10.17.0 --activate

# -------------- builder --------------

FROM base AS build
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Note: builds WITH placeholder env vars
RUN pnpm build:baked

# -------------- runner --------------

FROM nginx:1.29.1-alpine3.22-slim AS runtime
COPY ./docker/nginx.conf /etc/nginx/nginx.conf

# set dist folder path for both web folder and script arg
ENV DIST_PATH=/usr/share/nginx/html

# sufficient for SSG
COPY --from=build /app/dist ${DIST_PATH}

# copy to pre-start scripts folder
# 10-xxx controls the order
COPY ./scripts/replace-variables.sh /docker-entrypoint.d/10-replace-variables.sh
RUN chmod +x /docker-entrypoint.d/10-replace-variables.sh

EXPOSE 8080

