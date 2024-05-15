# Dockerfile from Astro docs

ARG NODE_VERSION=20.13.1

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app
# add git for reading commit info in node
RUN apk add --no-cache git

FROM base AS build
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
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

