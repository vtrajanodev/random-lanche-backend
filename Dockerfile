# Stage 1: Builder
FROM node:22-alpine AS builder

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml ./

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar todo o código-fonte
COPY . .

# Gerar Prisma Client e compilar TypeScript
RUN pnpm exec prisma generate
RUN pnpm run build

# Stage 2: Runtime
FROM node:22-alpine

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar apenas o package.json e pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Instalar todas as dependências (incluindo prisma que está em devDependencies)
RUN pnpm install --frozen-lockfile

# Copiar arquivos compilados do builder
COPY --from=builder /app/dist ./dist

# Copiar Prisma schema e migrations
COPY --from=builder /app/prisma ./prisma

# Expor porta
EXPOSE 3333

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3333', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Comando de inicialização
CMD ["sh", "-c", "pnpm exec prisma generate && pnpm exec prisma migrate deploy && node dist/main.js"]