#!/bin/sh
set -e

echo "Substituting runtime env variables..."

# without public/ after build
envsubst < /usr/share/nginx/html/env.template.js > /usr/share/nginx/html/env.js

exec nginx -g "daemon off;"
