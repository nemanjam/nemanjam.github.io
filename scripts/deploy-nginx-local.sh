#!/bin/bash

LOCAL_PATH="./dist"
REMOTE_PATH="~/traefik-proxy/apps/nmc-nginx-with-volume/website"
REMOTE_HOST="arm1"

# Navigate to the website folder on the remote server and clear contents of the website folder
ssh $REMOTE_HOST "cd $REMOTE_PATH && \
                  echo 'Listing files before clearing:' && \
                  echo 'List before clearing:' && \
                  ls && \
                  echo 'Count before clearing:' && \
                  ls -l | grep -v ^l | wc -l && \
                  echo 'Clearing contents of the folder...' && \
                  rm -rf * && \
                  echo 'List after clearing:' && \
                  ls && \
                  echo 'Count after clearing:' && \
                  ls -l | grep -v ^l | wc -l && \
                  echo 'Copying new contents...'"

# Copy new contents, 27MB
# Using scp
scp -rq $LOCAL_PATH/* $REMOTE_HOST:$REMOTE_PATH

# Using rsync
# rsync -az --progress $LOCAL_PATH/* $REMOTE_HOST:$REMOTE_PATH

# Using tar and ssh cat
# tar czf - -C $LOCAL_PATH . | ssh $REMOTE_HOST "cat > $REMOTE_PATH/dist.tar.gz && tar xzf $REMOTE_PATH/dist.tar.gz -C $REMOTE_PATH && rm $REMOTE_PATH/dist.tar.gz"


# List all files after copying
ssh $REMOTE_HOST "cd $REMOTE_PATH && \
                  echo 'List after copying:' && \
                  ls && \
                  echo 'Count after copying:' && \
                  ls -l | grep -v ^l | wc -l"




