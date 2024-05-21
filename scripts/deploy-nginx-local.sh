#!/bin/bash

# Navigate to the website folder on the remote server and clear contents of the website folder
ssh arm1 'cd ~/traefik-proxy/apps/nmc-nginx-with-volume/website && \
                        echo "Listing files before clearing:" && \
                        echo "List before clearing:" && \
                        ls && \
                        echo "Count before clearing:" && \
                        ls -l | grep -v ^l | wc -l && \
                        echo "Clearing contents of the folder..." && \
                        rm -rf * && \
                        echo "List after clearing:" && \
                        ls && \
                        echo "Count after clearing:" && \
                        ls -l | grep -v ^l | wc -l && \
                        echo "Copying new contents..."'

# Copy new contents
scp -rq ./dist/* arm1:~/traefik-proxy/apps/nmc-nginx-with-volume/website
# rsync -az --progress ./dist/* arm1:~/traefik-proxy/apps/nmc-nginx-with-volume/website


# List all files after copying
ssh arm1 'cd ~/traefik-proxy/apps/nmc-nginx-with-volume/website && \
                        echo "List after copying:" && \
                        ls && \
                        echo "Count after copying:" && \
                        ls -l | grep -v ^l | wc -l'



