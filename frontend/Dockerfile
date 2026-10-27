FROM node:18-alpine AS builder
WORKDIR /app
RUN apk add --no-cache git
RUN git clone https://github.com/Stremio/stremio-web.git .
RUN npm install
# Inject Animate.css and Custom Stylus Theme overrides
RUN npm install animate.css stylus
COPY custom.css /app/public/custom.css
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 8080
