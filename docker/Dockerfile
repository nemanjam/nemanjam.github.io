# Dockerfile from Astro docs

# alpine is fine
# node:22.1.0-bookworm, node:20.13.1-slim, node:20.13.1-alpine
ARG NODE_IMAGE=node:22.9.0-alpine

FROM ${NODE_IMAGE} AS base
WORKDIR /app

# for alpine
RUN apk add --no-cache git

FROM base AS build
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# override sharp 0.32.6 with 0.33.3, fails without this
RUN yarn remove sharp
RUN yarn add --ignore-engines sharp@0.33.4

COPY . .

ARG ARG_SITE_URL_ARM64
ARG ARG_SITE_URL_AMD64
ARG TARGETARCH

RUN if [ "$TARGETARCH" = "arm64" ]; then \
    SITE_URL=$ARG_SITE_URL_ARM64; \
  else \
    SITE_URL=$ARG_SITE_URL_AMD64; \
  fi && \
  echo "SITE_URL=$SITE_URL" && \
  echo "ENV SITE_URL=$SITE_URL" >> /etc/environment

ENV SITE_URL=${SITE_URL}

ARG ARG_PLAUSIBLE_SCRIPT_URL
ENV PLAUSIBLE_SCRIPT_URL=$ARG_PLAUSIBLE_SCRIPT_URL
RUN echo "PLAUSIBLE_SCRIPT_URL=$PLAUSIBLE_SCRIPT_URL"

ARG ARG_PLAUSIBLE_DOMAIN
ENV PLAUSIBLE_DOMAIN=$ARG_PLAUSIBLE_DOMAIN
RUN echo "PLAUSIBLE_DOMAIN=$PLAUSIBLE_DOMAIN"

RUN yarn build

FROM nginx:stable-alpine3.17-slim AS runtime
COPY ./docker/nginx.conf /etc/nginx/nginx.conf

# sufficient for SSG
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080

