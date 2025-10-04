FROM node:20-bookworm AS builder

RUN apt-get update && apt-get install -y --no-install-recommends git && rm -rf /var/lib/apt/lists/*
RUN corepack enable
RUN corepack prepare pnpm@9.15.4 --activate

WORKDIR /workspace

RUN git clone -b modern-package+maps --single-branch --depth 1 https://github.com/scarletsky/glsl-parser.git /workspace/glsl-parser

WORKDIR /workspace/glsl-parser
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store,sharing=locked pnpm install
RUN ./build.sh

WORKDIR /workspace/glsl.app

RUN mkdir -p server/src/main/resources
COPY server/src/main/resources/schema server/src/main/resources/schema

WORKDIR /workspace/glsl.app/app

COPY app/package.json app/pnpm-lock.yaml ./
COPY app/patches ./patches

RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store,sharing=locked pnpm install --no-frozen-lockfile

COPY app/ ./

RUN pnpm run build

FROM php:8.3-apache AS runtime

WORKDIR /var/www/html

COPY --from=builder /workspace/glsl.app/app/dist/ ./

EXPOSE 80

CMD ["apache2-foreground"]
