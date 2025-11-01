FROM node:20-bookworm AS builder

ARG APP_BASE_URL
ARG APP_GQL_ENDPOINT

RUN apt-get update \
    && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/* \
    && corepack enable \
    && corepack prepare pnpm@9.15.4 --activate

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

RUN if [ -n "$APP_BASE_URL" ] || [ -n "$APP_GQL_ENDPOINT" ]; then \
        rm -f .env.production.local && \
        touch .env.production.local && \
        { [ -z "$APP_BASE_URL" ] || echo "APP_BASE_URL=$APP_BASE_URL" >> .env.production.local; } && \
        { [ -z "$APP_GQL_ENDPOINT" ] || echo "APP_GQL_ENDPOINT=$APP_GQL_ENDPOINT" >> .env.production.local; }; \
    fi && \
    pnpm run build

FROM php:8.3-apache AS runtime

WORKDIR /var/www/html

RUN rm -rf /var/www/html/*

COPY --from=builder --chown=www-data:www-data /workspace/glsl.app/app/dist/ ./

EXPOSE 80

CMD ["apache2-foreground"]
