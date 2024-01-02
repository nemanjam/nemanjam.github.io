# Dockerfile from Astro docs

# adjust for monorepo

FROM node:20.10.0-slim AS base
WORKDIR /app

COPY package.json yarn.lock ./

FROM base AS prod-deps
RUN yarn install --production

FROM base AS build-deps
RUN yarn install --production=false

FROM build-deps AS build
COPY . .
RUN yarn build

FROM nginx:stable-alpine3.17-slim AS runtime
COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=prod-deps /app/node_modules /usr/share/nginx/html/node_modules
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080