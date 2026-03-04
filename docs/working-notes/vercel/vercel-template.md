
# Full stack FastAPI template Next.js

Developer blog built with Astro, with a comprehensive feature set and well-structured code.

Run your coding blog in minutes. Benefit from robust, understandable, well-separated code. Optionally customize design by modifying files in the components folder. Multiple deployment options, Vercel, Nginx, Github Pages and Docker.

## Screenshot

![Frontend screenshot](https://raw.githubusercontent.com/nemanjam/nemanjam.github.io/refs/heads/main/docs/screenshots/developer-blog-screenshot-1200x630.png)

## Demo

**Vercel: [https://nemanjam.vercel.app](https://nemanjam.vercel.app)**

**Nginx: [https://nemanjamitic.com](https://nemanjamitic.com)**

## Features

- Latest Astro, static, high performance website
- Post and Project content collections
- Tailwind responsive design
- Color themes with light/dark modes
- Tags and Categories, pagination
- Optimized images, view transitions
- Extracted constants, types, utils, configs, queries, assets
- Full TypeScript, Zod schemas, validated config
- ESLint, Prettier, path aliases, sorted imports
- React for interactive components
- Design system pages, latest commit info in footer
- Remote markdown content option
- Hierarchical layouts
- SEO friendly - sitemap, metadata
- Open Graph image, Satori generated
- Code syntax highlighting, Twitter/YouTube/OG-links embeds
- Giscus comments, Share post
- Draft posts, RSS and JSON feeds
- Vercel, GitHub Pages, Nginx, x86 and arm Docker deployments
- GitHub Actions workflows and local scripts

## Running locally

Install and run project locally for development. 

## Environment variables

This project uses static generation - **all environment variables are build-time only**. The values are inlined at build time and are immutable at runtime. Any variables defined at runtime will be ignored.

A list of required and optional environment variables: [.env.development.example](https://github.com/nemanjam/nemanjam.github.io/blob/main/.env.development.example).

## Installation and running

```bash
# install packages
pnpm install

# copy and set environment variables
cp .env.development.example .env.development

# run development server and visit http://localhost:3000
pnpm dev

# delete node_modules and pnpm-lock.yaml
pnpm clean
```

## Deploying to Vercel

### Vercel button

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnemanjam%2Fnemanjam.github.io&envDescription=https%3A%2F%2Fgithub.com%2Fnemanjam%2Fnemanjam.github.io%23environment-variables&envLink=https%3A%2F%2Fgithub.com%2Fnemanjam%2Fnemanjam.github.io%2Fblob%2Fmain%2F.env.production.example&project-name=Developer%20blog&repository-name=nemanjam.github.io&demo-title=Developer%20blog&demo-description=Developer%20blog%20template%20built%20with%20Astro%20and%20Tailwind.&demo-url=https%3A%2F%2Fnemanjam.vercel.app&demo-image=https%3A%2F%2Fraw.githubusercontent.com%2Fnemanjam%2Fnemanjam.github.io%2Frefs%2Fheads%2Fmain%2Fdocs%2Fscreenshots%2Fdeveloper-blog-screenshot-1200x630.png&skippable-integrations=1&from=templates&teamSlug=amy-vtest314)

Just click the button above and follow the wizard to create a new project, build it, and deploy it. 

By default, the `SITE_URL` environment variable is inferred from the predefined `VERCEL_PROJECT_PRODUCTION_URL`. You can also explicitly set a custom `SITE_URL`, as well as `PLAUSIBLE_DOMAIN` and `PLAUSIBLE_SCRIPT_URL`, to enable Plausible Analytics. 

After updating environment variables, you will need to rebuild and redeploy the app for the changes to take effect.

### Github Actions

In Vercel dashboard create a new project and set the environment variables. In Vercel account settings create a access token and set it as `VERCEL_TOKEN` Github repository secret. In Vercel project settings copy your user id and project id and set them as `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` Github repository secrets.

```bash
# Github repository -> Settings -> Secrets and variables -> Repository secrets

VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

Then just trigger the following workflow:

```bash
# .github/workflows

# uses Vercel CLI to pull, pre-build and deploy
# you must have an existing project and environment variables already defined on Vercel
vercel__deploy-manual.yml
```

**Detailed tutorial:** https://nemanjamitic.com/blog/2026-02-26-vercel-static-github-actions

## Credits

It reuses good solutions from other projects, see the [Credits list](https://github.com/nemanjam/nemanjam.github.io#credits).

