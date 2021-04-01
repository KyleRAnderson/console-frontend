FROM node:14-alpine AS builder
WORKDIR /app
COPY ./ ./
RUN yarn install --production false && yarn run build

FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 443
# Use the default entrypoint and command for nginx
