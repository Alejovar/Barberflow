# ── Etapa 1: dependencias y build ──
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

# ── Etapa 2: imagen de producción ──
FROM node:20-alpine AS production
WORKDIR /app
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci && npx prisma generate
ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/src/main"]