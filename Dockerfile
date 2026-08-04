# ============================================================
# Dockerfile produksi (multi-stage)
# Build:  docker build -t hr-app .
# Run:    docker run -p 3000:3000 --env-file .env hr-app
# (DATABASE_URL & NEXTAUTH_SECRET wajib di-pass via env saat run)
# ============================================================

# ---- Stage 1: dependency ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json pnpm-lock.yaml* ./
RUN npm install

# ---- Stage 2: build ----
FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate Prisma client untuk platform linux (beda dari hasil generate Windows)
RUN npx prisma generate && npm run build

# ---- Stage 3: runner (produksi, non-root) ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Hanya salin yang dibutuhkan saat runtime
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000

# Jalan sebagai server produksi (bukan dev server!)
CMD ["npm", "run", "start"]
