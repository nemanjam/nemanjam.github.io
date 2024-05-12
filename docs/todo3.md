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
```
