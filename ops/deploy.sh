#!/bin/sh

# Set environment variables
export COUNTDOWN_HOSTNAME=countdown.edwardsnjd.com

# Deploy stack
docker stack deploy \
    -c ops/stack.yml \
    --with-registry-auth \
    --prune \
    countdown