# Dockerfile from Astro docs

# alpine is fine
# node:22.1.0-bookworm, node:20.13.1-slim, node:20.13.1-alpine
ARG NODE_IMAGE=node:24.7.0-alpine

FROM --platform=$BUILDPLATFORM ${NODE_IMAGE} AS base
WORKDIR /app

# for alpine
RUN apk add --no-cache git

# installs pnpm correctly
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
RUN corepack prepare pnpm@10.17.0 --activate

FROM base AS build
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG ARG_SITE_URL_ARM64
ARG ARG_SITE_URL_AMD64
ARG TARGETARCH

ENV TARGETARCH=$TARGETARCH
RUN echo "TARGETARCH=$TARGETARCH"

RUN if [ "$TARGETARCH" = "arm64" ]; then \
    SITE_URL=$ARG_SITE_URL_ARM64; \
  else \
    SITE_URL=$ARG_SITE_URL_AMD64; \
  fi && \
  echo "SITE_URL=$SITE_URL" && \
  # must set SITE_URL via .env.production file for pnpm build, important
  # must use .env.production, .env doesn't work, my logic with dotenv in src/config/process-env.ts
  echo SITE_URL=$SITE_URL > .env.production;

RUN echo "ls -la=" && ls -la
RUN echo ".env.production file=" && cat .env.production

ARG ARG_PLAUSIBLE_SCRIPT_URL
ENV PLAUSIBLE_SCRIPT_URL=$ARG_PLAUSIBLE_SCRIPT_URL
RUN echo "PLAUSIBLE_SCRIPT_URL=$PLAUSIBLE_SCRIPT_URL"

ARG ARG_PLAUSIBLE_DOMAIN
ENV PLAUSIBLE_DOMAIN=$ARG_PLAUSIBLE_DOMAIN
RUN echo "PLAUSIBLE_DOMAIN=$PLAUSIBLE_DOMAIN"

RUN pnpm build

FROM nginx:stable-alpine3.17-slim AS runtime
COPY ./docker/nginx.conf /etc/nginx/nginx.conf

# sufficient for SSG
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080

