# Nginx image to serve static site
FROM nginx:alpine

COPY ./public/ /usr/share/nginx/html
COPY ./ops/nginx.conf /etc/nginx/conf.d/default.conf