FROM node:22-alpine AS builder

ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_GA_ID
ARG REVALIDATE_SECRET

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID
ENV REVALIDATE_SECRET=$REVALIDATE_SECRET

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable pnpm && \
    corepack prepare pnpm@10 --activate && \
    pnpm install --no-frozen-lockfile

COPY . .

RUN pnpm build

FROM node:22-alpine AS production

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY package.json pnpm-lock.yaml ./

RUN corepack enable pnpm && \
    corepack prepare pnpm@10 --activate && \
    pnpm install --no-frozen-lockfile --prod

COPY --from=builder /app/node_modules/typescript ./node_modules/typescript

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./

RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
ENV CI=true

CMD ["node_modules/.bin/next", "start"]
