FROM node:22-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl3

COPY package.json pnpm-lock.yaml ./

RUN corepack enable pnpm && \
    corepack prepare pnpm@10 --activate && \
    pnpm install --no-frozen-lockfile

COPY . .

ENV DATABASE_URL=mysql://dummy:dummy@localhost:3306/dummy

RUN npx prisma generate

RUN pnpm build

FROM node:22-alpine AS production

WORKDIR /app

RUN apk add --no-cache wget openssl3

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY package.json pnpm-lock.yaml ./

RUN corepack enable pnpm && \
    corepack prepare pnpm@10 --activate && \
    pnpm install --no-frozen-lockfile --prod && \
    npm install -g prisma@5.22.0 tsx

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/.prisma ./node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/.prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/src/proto ./dist/proto
COPY --from=builder /app/tsconfig.json ./

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 9999

ENV NODE_ENV=production
ENV PORT=9999
ENV GRPC_PORT=50051

EXPOSE 9999
EXPOSE 50051

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:9999/api/v1/health || exit 1

ENTRYPOINT ["/docker-entrypoint.sh"]
