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

---

global styles should be included in apps/nemanjamiticcom/src/components/BaseHead.astro
