# Builder
FROM node:alpine AS builder
RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune @pianno/app --docker

# Installer
FROM node:alpine AS installer
RUN apk add --no-cache libc6-compat
RUN apk --no-cache add \
    build-base \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    musl-dev \
    giflib-dev
RUN apk update

WORKDIR /app
RUN yarn global add pnpm
RUN yarn global add turbo

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN pnpm install

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN turbo build --filter=@pianno/app...

# Runner
FROM node:alpine AS runner
# Set timezone
RUN apk add --update --no-cache tzdata
ENV TZ=America/Sao_Paulo

# Install system dependencies required for node-canvas
RUN apk add --no-cache cairo pango libjpeg giflib
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/pianno/next.config.js .
COPY --from=installer /app/apps/pianno/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/pianno/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/pianno/.next/static ./apps/pianno/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/pianno/public ./apps/pianno/public

CMD node apps/pianno/server.js