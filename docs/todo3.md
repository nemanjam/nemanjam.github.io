```ts
// here
my PageInfo component, reading time, date, tags...
    fix relative path in PostCard from tags and categories
navbar text colors, remove buttons
astro.config.ts from paularmstrong
light code theme
blog designs from my telegram
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
breadcrumb for navigation, categories
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
clone hashnode, dev.to, responsive fonts, vertical margins, etc

-------
// theme
both selectors are needed, .dark za dark: modifier, data-theme za color temu
darkMode: ['selector', '[data-theme="dark"]'],
scroll broken in chrome, remove smooth css
-------
hashnode h1, h2, p...
tailwindui gradients, linkedin blog
move component to my-prose class_
    style tags
style categories and tags list pages
procitaj transition docs
    navbar buttons to links
add astro and fastapi in resume
-----
    close mobile header on md
// group-[.menu-open]: increases specificity everywhere
// group-[.menu-open]:flex-col md:!flex-row, both on flex-direction
-----
prose vec ima sve stilove kako treba, samo h1 ogranici na 48px jer je prose-xl
umotaj sve u prose u Base layout, pa samo nekoliko slotova no-prose
add colors and gradients to h1 maybe
fix colors for all text
    fix json.parse for theme
finish project list html
    extract pagination into layout
remove redundant section and article tags from layouts
    extract Metadata type_ and fix Base layout props
    improve PostItem image and rest
ul li PostList, ProjectList
not-prose not working for my-prose
not-prose fails for font-size, inherited from <main />, i za cn(proseClasses)
keep all breakpoints in sync, prose-lg, h1 sizes, py layout
add class_ variance authority
fix env files for docker
docker build local je x86, more qemu, buildx
links colors and styles, uncomment visited later
    PostItem - for constant card height, line-clamp-x on description based on number of chars in title
text hover transition
limit to prose-lg 18px
theme toggle icon sun
fix MorePosts components, create cards
fix Footer
fix transform in Post schema
extract widths and sizes for images in reusable object, for thumbnails, in constants/images

slug se explicitno prosledjuje samo u getStaticPaths koje nemaju paginate (bez [...page].astro)
export async function getStaticPaths() {
  const pages = await getAllProjects();

  const paths = pages.map((page) => ({
    params: { slug: page.slug },
    props: { page },
  }));

  return paths;
}
    slug nepotreban u schemi, i calc od datuma, glupost
use single Post or PostCollection type_ everywhere
rewrite Pagination component
find footer examples
social links component for footer, array of constant objects and map
accessibility, tab, focus, aria, nav, ul li, header, article
icon link button
use primary color so it makes sense
extract all ui in components and render them in styleguide
fix codeblocks style and find light theme, highlight selected line
    reduce font-size and width PostListItems for balance with_ navbar, maybe blog heading and typography too
add giscuss comments
algolia search .md, later
    more posts cards
date and minutes read absolute div over card
3xl and prose-lg looks good with navbar, list 660px
    footer two columns

// more posts
https://the-green-chronicle.esteban-soubiran.site/articles/the-organic-chronicles-transitioning-to-chemical-free-farming
https://guillaumeduhan.hashnode.dev/ive-build-a-reusable-team-component-for-nextjs-14-using-supabase

fix Post and PostCollection types, Post has readingTime (calc props) and PostCollection only frontmatter
concat routes helper
rewrite for loops await with Promise.all()
    LinkButton
404 page style
pagination with numbers
    category div, MorePostsCard, Post
move vertical padding to correct layout
    refactor Post layout
remove config folder for code theme, add light theme and fix styles
rename header to navigation
open components to pass class: className
post hero title and description custom style without prose
    style proper footer
style table of contents
// type for class
export type Props = astroHTML.JSX.AnchorHTMLAttributes;
    extract vertical paddings
vertical spacing svuda isti, top, bottom, headings, sections
    tags and categories page, filter radio buttons
share widget, research examples
aside - alert component
images border radius
remove unused components
  cva, class_ variance authority everywhere
all buttons are links, add more button variants in Link component, button has size, link doesnt
link and primary are same color
--th-headings, captions links, singular plural
remote bookmarks md page, fetch bookmarks md and render as page, ssg
next: alert - aside and share widgets, simple work
my logo and favicon
search behance and awwards for design inspiration, vertical card blog list
style PostMeta
generate Twitter intent link, use react share component
range in pagination, leave only 3 numbers
disabled color?, daysy ui
must use flex flex-grow in all containers for full height
    filter page with buttons for categories and tags
Button component
    color-mix(...) css native function_, oklch color system, u daisy ui for hover, focus colors, pogledaj
rename ItemWithCountList, tags-and-categories
add more buttons, size, primary, secondary
    isActive tag and category
noHeading layout
restyle PostMeta component
    fix schema validation for tags and categories
    og images
    tags in post
render all components in styleguide
sredi passing metadata u layouts, h1, description, image
design og image
    create og image for pages, glob, zapravo ne, samo jedna default slika za sve ti treba, prosledis u metadata u Base layout
postavi i description i title svuda u metadata, u Base default
    check all meta tags in BaseHead
color themes

must pass env var SITE_URL at build time
"build:nginx": "SITE_URL='https://nemanjamitic.com' astro build",
categories - images or icons with cards
codesandbox embed
cva default styles vs default variant, primer
astro 4.10 types and zod for env vars
    style CategoryListCard
small PostItem, maybe with filter Explore page
colors for CategoryCard
extract all lists with render props, maybe
// types
move all types in types folder
check types for as const objects and arrays
-----
// og image
design transparent logo for default ogImage
index.mdx goes to page.png by default by lib, see in yarn build log
handle og images for 404 pages, recursion
og png image text position and transparent
    metadata final clean up and ogImage for List layout
is hero image og image? // jeste
tkdodo for post combines hero image with og image, read heroImage from contentCollection
Page Layout the only layout in which is created og image, other og images created in pages
----
handle pagination for one page, research examples
    fix color palette for text and bg, daisy ui
icon slot for button, button variants, color, size, condensed
    separate css files for tailwind components
default and neutral are separate semantic colors
-----
    PostCard - needs space, paddings, color, read more, hashnode and flowbite, support without image variant too
    postojeci vertical spacing zbijen
    primary-hover, secondary-hover...
    primary-base-200, primary-base-300
    remove accent, neutral

// semantic colors benefits, put in list
https://daisyui.com/docs/colors/#-1

accent - to accent primary
secondary - for backgrounds...

fix all PostCards to handle without image, noHero: true
table of contents styling
fix image sizes for new PostCard
link and primary single color
put all components and variants in styleguide, loops for variants
    daisy ui color-mix() and oklch just to calc hover colors, i dont need it, hardcode it
    sorted archive like in astro-cactus, route param highlight and link
    refactor rss and json feed
ProjectCard and test markdown
    PostCardSmall
    extract types from constants
update yarn scripts for eslint, prettier, types // to
    404 page design
    PostCard updatedDate
post collection date md filename and publishDate?
tag variants styles // to
category pill
    updatedDate publishDate edit icon
images sizes for new PostCards
layout bottom padding
start writing readme
working-notes folder in docs
footer commit toast
    draft preview for prod
fix button not-prose
write content and design for pages, research
    yarn scripts
Dockerfile has arm hardcoded
tsconfig.json strictest
eslint 8.57 fine tune config

----
og image design
share
    code blocks and theme
    code blocks responsive fonts 14, 16px, md or lg?
    pagination 3 items
styleguide
    sitemap
    transistor favicon
    rewrite env vars with new types and import.meta instead of process.env // ne moze naravno, ok je ovako
transitions
render mdx for rss feed content
    Promise.all for all render, feed, toc
fix git text in footer
make design-system with many mdx files, colors, layouts, buttons, links, etc, like storybook
fora moras astro jsx da exportujes, a ne react componentu
mdx image gallery, modal
nested my-prose and not-prose problem in .mdx pages for cards, buttons...
mdx intelisense extension
mdx gallery
tailwind not-prose question // to
navigation for design system pages
table of contents styling
components into folders
format mdx, autocomplete, it was in prettierignore
expanded image must not use width less than expanded width, wont be centered
load bookmarks repo on build
image gallery grid
fix image vertical margins, widths and width everywhere, constants
resenje za tailwind - layer component classes za p, h4...
index.mdx in design-system folder with navigation
embed youtube, twitter, link https://github.com/delucis/astro-embed
add categories and tags links in footer
giscus, share, transitions, PostInfo, format og image, image constants, h4 p css cva components, astro-embed yt, twitter, codesandbox
```
