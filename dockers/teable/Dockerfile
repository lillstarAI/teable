ARG NODE_VERSION=20.9.0
ARG BUILD_VERSION="1.0.0-beta"

# Stage 1: Install dependencies
FROM node:${NODE_VERSION}-bookworm AS deps
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && pnpm add npm-run-all2 zx -g

ENV HUSKY=0

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
RUN pnpm fetch
COPY . .
RUN pnpm install --prefer-offline --frozen-lockfile
RUN pnpm -F @teable/db-main-prisma prisma-generate --schema ./prisma/postgres/schema.prisma

# Stage 2: Build the app
FROM deps AS builder

ARG BUILD_VERSION
ARG ENABLE_CSP=true
ARG SENTRY_ENABLED=true
ARG SENTRY_TRACING=true

ENV NODE_ENV=production \
    NEXT_BUILD_ENV_CSP=${ENABLE_CSP} \
    NEXT_BUILD_ENV_TYPECHECK=false \
    NEXT_BUILD_ENV_LINT=false \
    NEXT_BUILD_ENV_SENTRY_ENABLED=${SENTRY_ENABLED} \
    NEXT_BUILD_ENV_SENTRY_TRACING=${SENTRY_TRACING}

WORKDIR /app

COPY .env ./
COPY apps/nextjs-app/.env ./apps/nextjs-app/.env

RUN set -ex; \
    echo "NEXT_PUBLIC_BUILD_VERSION=\"${BUILD_VERSION}\"" >> apps/nextjs-app/.env; \
    NEXT_BUILD_ENV_LINT=false NODE_OPTIONS=--max-old-space-size=8192 pnpm g:build
        
# Stage 3: Post Builder
FROM builder as post-builder

ENV NODE_ENV=production

WORKDIR /app

RUN set -ex; \
    rm -fr node_modules; \
    pnpm nuke:node_modules; \
    chmod +x ./scripts/post-build-cleanup.mjs; \
    zx ./scripts/post-build-cleanup.mjs; \
    pnpm install --prod --prefer-offline --frozen-lockfile; \
    pnpm -F @teable/db-main-prisma prisma-generate --schema ./prisma/postgres/schema.prisma

# Stage 4: Final image
FROM node:${NODE_VERSION}-bookworm-slim AS runner

ARG TZ
ARG NODE_ENV
ARG PORT
ARG BRAND_NAME
ARG NEXTJS_DIR

ENV TZ=${TZ} \
    NODE_ENV=${NODE_ENV} \
    PORT=${PORT} \
    BRAND_NAME=${BRAND_NAME} \
    NEXTJS_DIR=${NEXTJS_DIR}

RUN apt-get update && apt-get install -y curl openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs && \
    mkdir .assets .temporary && \
    chown -R nodejs:nodejs /app

COPY --from=post-builder --chown=nodejs:nodejs /app/apps/nextjs-app/next.config.js \
                    /app/apps/nextjs-app/next-i18next.config.js \
                    /app/apps/nextjs-app/package.json \
                    /app/apps/nextjs-app/.env \
                    ./apps/nextjs-app/

COPY --from=post-builder --chown=nodejs:nodejs /app/apps/nextjs-app/.next ./apps/nextjs-app/.next
COPY --from=post-builder --chown=nodejs:nodejs /app/apps/nextjs-app/node_modules ./apps/nextjs-app/node_modules
COPY --from=post-builder --chown=nodejs:nodejs /app/apps/nextjs-app/public ./apps/nextjs-app/public

COPY --from=post-builder --chown=nodejs:nodejs /app/apps/nestjs-backend/dist ./apps/nestjs-backend/dist
COPY --from=post-builder --chown=nodejs:nodejs /app/apps/nestjs-backend/node_modules ./apps/nestjs-backend/node_modules
COPY --from=post-builder --chown=nodejs:nodejs /app/apps/nestjs-backend/package.json ./apps/nestjs-backend/

COPY --from=builder --chown=nodejs:nodejs /app/packages/common-i18n/ ./packages/common-i18n/

COPY --from=post-builder --chown=nodejs:nodejs /app/packages ./packages
COPY --from=post-builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=post-builder --chown=nodejs:nodejs /app/package.json ./package.json

EXPOSE ${PORT}

USER nodejs

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT}/health || exit 1

ENTRYPOINT ["node", "apps/nestjs-backend/dist/index.js"]
