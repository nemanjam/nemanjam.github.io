# Astro blog - [nemanjamitic.com](https://nemanjamitic.com)

This is the repository for my coding blog [nemanjamitic.com](https://nemanjamitic.com). Free and open source, feel free to reuse code and customize for your own developer blog. Blog posts (future) require attribution.

## Mirrors

| Method       | Url                                      |
| :----------- | :--------------------------------------- |
| Nginx        | https://nemanjamitic.com                 |
| Github pages | https://nemanjam.github.io               |
| Docker       | https://nmc-docker.arm1.nemanjamitic.com |

## Screenshots

![Screenshot_1](/docs/screenshots/Screenshot_1.png)

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
- Hierarchical layouts
- SEO friendly - sitemap, metadata
- Open Graph image, Satori generated
- Code syntax highlighting, Twitter/YouTube/OG-links embeds
- Giscus comments, Share post
- Draft posts, RSS and JSON feeds
- GitHub Pages, Nginx, x86 and arm Docker deployments
- GitHub Actions workflows and local scripts

## Motivation

By the end of 2023. I started thinking about capturing insights from my usual daily coding work into rounded blog articles, so I started looking for a clean, minimalistic and well structured blog template. I started researching and considered Jekyll, Hugo, Next.js but eventually realized that currently Astro is the best tool for a static, personal website.

Then I researched and reviewed all open source Astro examples that I could find with intention to reuse it and just customize styles but none of them met my preference for code structure and desired features, so I decided to compile the best parts from all of them into a structure and coding style of my own liking. See the [Credits](#credits) section bellow.

I intend to use this website for years to come, so I consider the extra effort well spent. Additionally, it helped me gain some practical experience with Astro in the process.

## Installation

#### Environment variables

In development you can see draft posts by default.

```bash
# .env.development

# this var is always without trailing slash '/'
SITE_URL=http://localhost:3000
```

```bash
# .env.production

SITE_URL=https://nemanjamitic.com

# set to true to preview draft posts in production
PREVIEW_MODE=
```

#### Development

```bash
# install packages
yarn install

# copy and set environment variables
cp .env.development.example .env.development

# run development server and visit http://localhost:3000
yarn dev

# delete node_modules and yarn.lock
yarn clean
```

#### Production

```bash
# copy and set environment variables
cp .env.production.example .env.production

# build website
yarn build

# run website and visit http://localhost:3000
yarn start
```

## Implementation details

## Deployment

## Roadmap

- Add accessibility attributes
- Add image gallery page
- Add remote markdown page
- Validate config with `astro:env`
- Render `.mdx` for RSS using component containers
- Review and improve ESLint, (strictest) Typescript and Prettier configs
- Improve visual design

## Credits

The most important projects, examples, demos, resources that I reused and reviewed:

- Starter project, initial structure, some components, some plugins, integrations, libs, styling choices - repo: [paularmstrong/paularmstrong.dev](https://github.com/paularmstrong/paularmstrong.dev), blog: https://paularmstrong.dev/blog
- Navbar responsive menu, theme toggling - repo: [chrismwilliams/astro-theme-cactus](https://github.com/chrismwilliams/astro-theme-cactus), demo: https://astro-cactus.chriswilliams.dev/posts
- Astro collections schemas, some visual design decisions - repo: [billy-le/billyle.dev](https://github.com/billy-le/billyle.dev), blog: https://billyle.dev
- Giscuss comments, Satori og-image - repo: [thomasledoux1/website-thomas-astro](https://github.com/thomasledoux1/website-thomas-astro) , blog: https://website-thomas-astro.vercel.app, repo: [TkDodo/blog](https://github.com/TkDodo/blog), blog: https://tkdodo.eu/blog
- Deployment with Docker and Nginx - docs: https://docs.astro.build/en/recipes/docker
- PostCard component design - site: https://flowbite.com/blocks, demo: https://mistral.bloggrify.com
- PostCardSmall component design - demo: https://epoxia.bloggrify.com/archives
- Design inspiration and reference - https://hashnode.com, https://medium.com, https://dev.to, https://www.developerway.com
- Tailwind themes, dark mode, CSS structure, semantic colors - site: https://daisyui.com, repo: https://github.com/saadeghi/daisyui

### Other credits

Other projects, examples, demos, resources that I reused and reviewed:

- Repo: [surjithctly/astroship](https://github.com/surjithctly/astroship), demo: https://astroship.web3templates.com
- Repo: [satnaing/astro-paper](https://github.com/satnaing/astro-paper), demo: https://astro-paper.pages.dev/posts
- Repo: [onwidget/astrowind](https://github.com/onwidget/astrowind), demo: https://astrowind.vercel.app
- Repo: [JustGoodUI/ovidius-astro-theme](https://github.com/JustGoodUI/ovidius-astro-theme), demo: https://ovidius-astro-theme.netlify.app
- [one-aalam/astro-ink](https://github.com/one-aalam/astro-ink)
- Repo: [treefarmstudio/odyssey-theme](https://github.com/treefarmstudio/odyssey-theme), demo: https://odyssey-theme.sapling.supply
- Official blog example project - repo: [withastro/astro/tree/main/examples/blog](https://github.com/withastro/astro/tree/main/examples/blog)
- Gatsby example - repo: [alxshelepenok/gatsby-starter-lumen](https://github.com/alxshelepenok/gatsby-starter-lumen), demo: https://lumen.alxshelepenok.com
- Shadcn Astro - repo: [mickasmt/astro-nomy](https://github.com/mickasmt/astro-nomy)
- Without Tailwind - repo: [rezahedi/rezahedi.dev](https://github.com/rezahedi/rezahedi.dev) , blog: https://rezahedi.dev
- Vue - demos: https://bloggrify.com/templates
- Keystatic CMS - repo: [simonswiss/simonswiss.com](https://github.com/simonswiss/simonswiss.com), blog: https://simonswiss.com
- Tailwind designs and gradients - site: https://tailwindui.com/templates
- Next.js - repo: [SSTPIERRE2/stephenstpierredotcom](https://github.com/SSTPIERRE2/stephenstpierredotcom)
  , blog: https://stephenstpierre.com/blog
