```tsx
add search
https://website-thomas-astro.vercel.app/blog/search-static-astro-website

------
// https://www.mazipan.space
https://github.com/mazipan/mazipan.space
article, explore two columns design, wider main 
primary button color, cta
links always blue, separate primary color
condensed category button
blog card category and time bellow, image on top 
blog wider main 
change base font (in themes)
breadcrumbs
-----

gallery lazy load, blur, pagination on scroll


git checkout -b feature/astro-v5

------------
astro v5
// these 2 fail with react 19, unrelated to astro 5, gallery page fails
"react-grid-gallery": "^1.0.1",
"react-image-lightbox": "^5.1.4",

migrate gallery to astro components
migrate content collections to content layer, restructure folder with slug to contain images
------------
// content layer
git checkout -b feature/content-layer

id, slug, decoupled with my custom type Post[], Project[], from CollectionEntry<T>
folder name with slug and colocated images
remote collection for links page?
-----------
folders with index 
https://github.dev/LeaVerou/lea.verou.me

git checkout -b refactor/folder-slug
----------

git checkout -b feat/add-hn-project

markdown link in new tab, styles
my-prose-project
semantic release, conventional commits
----------

// tailwind 4
git checkout feat/tailwind4-v2
----------
    astro markdown link in new tab
mdx not formatting, prettierignore, breaks them
for screenshots use new not private window and select window in screenshot tool, not screen or selection, hide dock for 16/9 // important
breadcrumb navigation, projects
    random image client component for Home page, onClick
use picture with srcSet for Home image
solve loading fallback for async client image
astro image as react child, wont work because of props
https://docs.astro.build/en/guides/images/#images-in-ui-framework-components
------------
https://github.com/RafidMuhymin/astro-imagetools // not needed actually, placeholder...
load on scroll?
------------
git checkout feat/new-gallery

use api route same as og-image, for gallery and home
placeholder - blur, bg-color, single // extract line
img with srcset

rename all-images to gallery-images
endpoint to create open graph images, because they dont exist in the file system

// only in dev
http://localhost:3000/_image?href=/@fs/home/username/Desktop/nemanjam.github.io/src/assets/images/all-images/morning1.jpg?origWidth=4608&origHeight=2592&origFormat=jpg&w=1280&h=720&f=webp

// in prod
http://localhost:3000/_astro/focus1.CEdGhKb3_nVk9T.webp

image 100% width and height, fills container that controls size // must do it like this for server component
// explain in chatgpt
<img 
  srcset="
    image-480w.jpg 480w, 
    image-768w.jpg 768w, 
    image-1200w.jpg 1200w"
  sizes="
    (max-width: 480px) 100vw, 
    (max-width: 768px) 50vw, 
    33vw"
  src="image-1200w.jpg"
  alt="A responsive image example" />

blur preloader makes no sense for thumbnails, better css blur transition
ImageBlurPreloader should support srcset or picture tag

remove old gallery code and upgrade to react 19
extract types

-----
scroll to top, has bug in article mdx layout, bottom position and horizontal scroll
add delay to fetch new page, debounce
phone tap on backdrop doesnt close lightbox
responsive page size
usehooks, isVisible or observer hook for infinite scroll, thumbnail, scroll to top

// important for size of all client components
height and width MUST be defined ON SERVER component to prevent layout shift 

----
img srcset
copy hooks for width for page size and observer form react-use or usehooks
rename all-images to gallery-images or gallery
og-image has its own random folder, reuse all gallery images
--------
fora-1: astro Image client component sa getImage({widths, sizes}) create responsive <img /> props
fora0: cant pass props from client component to child server component - slot (astro Image component)
fora1: margin collapsing disabled in flex, grid, mdx container
fora2: client component size must be set in server component to prevent layout shift (flex or height and max-height)
fora3: px suffix for style={{width, height}} in react
--------
must pass widths i sizes u getImage() za responsivne slike
eventi ne moze na <img /> ali moze na <div /> okolo, <Image /> ide u slot // no scroll transition, no blur preloader
bolje props od getImage()
```


