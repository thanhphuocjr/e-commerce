
# Stage 1: Build React APP
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG REACT_APP_GATEWAY_API_URL=/api
ARG REACT_APP_API_TIMEOUT=10000
ENV REACT_APP_GATEWAY_API_URL=$REACT_APP_GATEWAY_API_URL
ENV REACT_APP_API_TIMEOUT=$REACT_APP_API_TIMEOUT

RUN npm run build

# Stage 2: Server App By Nginx

FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
