# Build 階段
FROM node:18 AS build
WORKDIR /frontend
COPY . .
RUN npm install
RUN npm run build

# Nginx 階段
FROM nginx:1.19
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /frontend/dist /usr/share/nginx/html
