# 使用官方Node.js镜像作为基础镜像
FROM node:20.11.1 AS build

# 设置工作目录
WORKDIR /frontend

# 将package.json和package-lock.json复制到容器中
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制源代码并构建应用
COPY . .
RUN npm run build

# 第二阶段，使用 Nginx 作为基础镜像
FROM nginx:1.19
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /frontend/build /usr/share/nginx/html
