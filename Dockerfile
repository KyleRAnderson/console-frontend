FROM node:14-alpine AS builder
WORKDIR /app
COPY ./ ./
ENV NODE_ENV=production
RUN yarn install --production false && yarn run build

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 443
# Use the default entrypoint and command for nginx
