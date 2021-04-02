FROM node:14-alpine AS builder
WORKDIR /app
COPY ./ ./
ENV NODE_ENV=production
RUN yarn install --production false && yarn run build

FROM nginx:1.19-alpine
ENV APP_ROOT_LOCATION=/usr/share/nginx/html
COPY --from=builder /app/build ${APP_ROOT_LOCATION}
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 443
# Use the default entrypoint and command for nginx

# Copy the init script over to the init script directory, where the nginx entrypoint will call it.
COPY docker/config-initializer.sh /docker-entrypoint.d/