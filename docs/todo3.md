```ts
// here
my PageInfo component, reading time, date, tags...
fix relative path in PostCard from tags and categories
navbar text colors, remove buttons
astro.config.ts from paularmstrong
light code theme
blog designs from telegram
theme icon
relocate to assets folder, icons, images
images beside article md
twMerge instead of clsx
date-fns umesto pad for getSlug
extract getLinks functions for href
ProjectCard component
ProjectGrid, PostList
vector hero, 3d grafika
navbar fullwidth
giscus comments
image loader with blur
----
analiziraj layouts u ostalim
<Section />  za vertical sections, flex-col
<Container /> za horizontalno centriranje i padding
Labs layout - u .md stavlja container i kolone, za proizvoljnu sirinu // zapazi
<SiteWrapper><Container><Prose>
  <slot />
</Prose></Container></SiteWrapper>
---
// bzvz, zapazi
import Container from '../../components/Content.astro';
------
// base
meta head - title, description, ogImage
container - center, max-width, padding, responsive
main
// page - za .md stranice
h1
prose - moze klasa, plus <Prose />
article
sections, rows - vertical flex-col
// post item
hero image,
h1 title, // nema description ovde
PostMeta - category, tags, author, date, reading time
TagList
prose
share
more posts
// list, grid - post (all, tags, categories), project
h1, desc
nema prose
pagination
// FullWidth (Project, Labs)
no container
-----------
twMerge, class_ variants authority
add all components to styleguide
hero image full width
hashnode PostItem card with details
header in layout, ListLayout, PostLayout, PageLayout, FullWidthLayout
fix active navbar item
baseline for layout, w-screen, min-h-screen, tagovi, prouci
breadcrumb for navigation
responsive fonts
<main /> full height screen - header - footer
asChild for Container and Prose
----
update github actions after monorepo
print commit hash and message in html, node package_
analytics in BaseHead with goatcounter.com and sentry
add author email, social networks, name to constants
active item in navbar
dark mode, fix dark: modifier
----
// fix sharp yarn
// https://github.com/withastro/astro/issues/9345#issuecomment-1868330138
pin to "sharp": "0.32.6",

----
// docker arm
can use nginx alpine without node for final prod image, 15mb
must use arm1.nemanjamitic.com for correct dns
must use docker login in ssh for private image
must use qemu and buildx for arm linux/arm64 docker image
cant use node-alpine for sharp // wrong, both alpine, slim and bookworm will work
must add apt-get git in node-slim, for commit info in html on build
must not add .git in dockerignore
must add script_stop: false for non existing image in ssh deploy

----
// sharp radi na alpine // ok
node:22.1.0-bookworm - has git
node:20.13.1-slim - doesnt have git
node:20.13.1-alpine - doesnt have git
// to, 0.32 radi samo na x86, 0.33 radi i na arm ali mora -ignore-engines
sharp 0.32.6 - black resized thumbnails in docker arm
sharp 0.33.3 - must use --ignore-engines, ok thumbnails on arm
// override
RUN yarn add --arch=arm64 --platform=linux --libc=musl --ignore-engines sharp@0.33.3
// samo ovo bi radilo, ali ajde
RUN yarn add --ignore-engines sharp

-----------
sm
p - 14px
h1 - 30/14em - 30px

base
p - 16px
h1 - 36/16 - 36px

lg
p - 18
h1 - 48/18 - 48px

xl
p - 20
h1 - 56/20 - 56px

2xl
p - 24
h1 - 64/24 - 64px



window.getComputedStyle(document.querySelector('html')).fontSize;
```
