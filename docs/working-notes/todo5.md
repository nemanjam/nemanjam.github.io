

git checkout -b feature/runtime-environment-variables

------
url functions fail with baked
will undefined siteUrl be inlined in astro.config.ts? look in astro docs
wrong, defaults to http://localhost:3000/ for undefined, must use bakedUrl
        convert preview_mode to string union
update readme and docs for runtime env vars
        print env hidden in <pre/> html for debug // TO
configure local build .env.production, .env.development
----
astro did lowercase
<meta property="og:image" content="https://baked_site_url/api/open-graph/pages.png">
convert host to getHost(), no vars, pure functions
urls utils file with pure functions
baked domain in og image satori template // images created build-time, cant be solved
-----
config must support build with both baked and real vars
update traefik-proxy repo