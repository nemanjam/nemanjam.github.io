```tsx
// name blog files like this
src/content/blog/2022-10-14-tech-design-template.mdx

---

<Picture /> is for statically hosted images from public directory

import { Image } from 'astro:assets';
<Image /> is for imported images from src/images/blog

maybe :port breaks getStaticPaths slug route
http://localhost:3000/

solution:
it was trailing slash /, damn, trivial
http://localhost:3000/blog/2024-01-16-example-article-1/

it was this in `astro.config.mjs`
trailingSlash: 'always', // default 'ignore'

---

-------- add .env file for dev and prod and vars with zod validation
-------- pagination still not working [...page].astro blog/1 unhandled
redesign navbar, color palette and all other components
giscuss
rewrite solid to react
move components to monorepo
tags, categories?
extract tailwind from plugins to css files
it doesnt have og:image, must reuse it from other project
also doesnt have search
extract post card component
print tags and category in PageInfo component in article
for tags and categories use design from astrowind
tags and category pages
add codesandbox embed
what in shared tailwind.config.ts what in blog? fix .js, .mjs, .ts for tailwind and postcss
use styles from other theme
search prose examples
style card, navbar
put Config in import.meta.env
date-fns
make color palette for text, muted, active...
// astro-paper
https://github.com/satnaing/astro-paper/blob/main/src/styles/base.css
https://github.com/satnaing/astro-paper/blob/main/tailwind.config.cjs
extract all css in separate files and import them

---

// astro-theme-cactus
https://github.com/chrismwilliams/astro-theme-cactus/blob/main/src/styles/global.css
https://github.com/chrismwilliams/astro-theme-cactus/blob/main/tailwind.config.ts

// shadcn
https://github.com/shadcn-ui/taxonomy/blob/main/styles/globals.css
https://github.com/shadcn-ui/taxonomy/blob/main/tailwind.config.js

// astrowind, trivial
https://github.com/onwidget/astrowind/blob/main/src/components/CustomStyles.astro
https://github.com/onwidget/astrowind/blob/main/tailwind.config.cjs

---

global styles should be included in apps/nemanjamiticcom/src/components/BaseHead.astro
PostCard has standalone styles, doesn't depend on prose in page
semantic html cheatsheet

---

semantic colors for text and brand
og images from cactus, paularmstrong has all components
extract configurations in separate files from tailwind.config.ts

---

Link component only styles here, Astro Link component, other examples?
organize <Prose /> usage
jedan prose u root srusi sav spacings i paddings

reuse color vars and semantic vars from alxshelepenok/gatsby-starter-lumen

---

choose colors for category, links hover, visited
dark:link styles
card final styles, show all components in styleguide
rewrite bustout float with negative margin
style collapsible navbar, footer
define semantic color palette
read astro transitions docs transition:name={`content-${slug!.replace(/.*\//, '')}`}
[...page].tsx and [slug].tsx handle getStaticPaths and page, extract components
reuse og image generation https://github.com/paularmstrong/paularmstrong.dev/commit/e073bb5a20c94f91273f102f43445dce46115012
clean up layout container to be minimal, gledaj gotov html u browser
style tag button
set aspect ratio to image

src/pages/blog/[slug].astro
share alert, extract in component
more posts, extract in component
make skeletons
lot of work on styling
twMerge
    dupli tailwind css u browser? - solved, applyBaseStyles: false in astro.config.mjs
radix themes maybe? radix with astro?

---

responsive navbar
https://github.dev/Taofiqq/navbar-react-css
https://blog.logrocket.com/create-responsive-navbar-react-css/

decide semantic colors for links, tags, neutral... and choose colors
black, white, gray, primary
add tag and category to info alert
clean up and fix markup in blog/[slug].astro
use radix-ui primitives for all components
heading component from radix-ui
extract components, widgets folder
class_ variance authority maybe
    add date-fns and write util functions
fix theme switch
```
