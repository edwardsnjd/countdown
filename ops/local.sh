#!/bin/sh

# Build image
docker build -t countdown:local .

# Run image
docker run --rm -p 8080:80 countdown:local