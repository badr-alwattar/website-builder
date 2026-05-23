# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build the application
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
# prisma generate validates DATABASE_URL from prisma.config.ts but does not connect.
# Runtime URL comes from .env via docker compose env_file (not copied into the image).
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"

# Generate Prisma client (outputs to ./generated/prisma)
RUN node node_modules/prisma/build/index.js generate

RUN npm run build

# Stage 3: Production runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Next.js standalone output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma generated client (lives at ./generated, not in node_modules with v7)
COPY --from=builder --chown=nextjs:nodejs /app/generated ./generated

# Full node_modules so the Prisma CLI has all its transitive dependencies
# (selective copying breaks on deep dep chains like @prisma/config → effect → ...)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Prisma migration files + config
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run migrations via real binary path (avoids __dirname issue with .bin symlink),
# then start the Next.js standalone server
CMD sh -c "node node_modules/prisma/build/index.js migrate deploy && node server.js"
