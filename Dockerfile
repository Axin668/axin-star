# 使用 Node.js 16 的官方 Alpine Linux 基础镜像
FROM node:16-alpine
LABEL authors="axin"

# 设置工作目录为 /app
WORKDIR /app

# 挂载点
VOLUME /app/axin-star-fev

# 暴露容器的 3000 端口
EXPOSE 3000

# 定义环境变量, 以便在容器内部访问
ENV NODE_ENV=prodution

# 时区修改
RUN /bin/cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \&& echo 'Asia/Shanghai'  >/etc/timezone
