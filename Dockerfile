# Build stage
FROM node:22-alpine AS builder

# Enable Corepack
RUN corepack enable
# Prepare and activate pnpm (you can specify a specific version if needed)
RUN corepack prepare pnpm@latest --activate

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm prebuild
RUN pnpm build

# Production stage
FROM node:22-alpine AS production

# Enable Corepack
RUN corepack enable
# Prepare and activate pnpm (you can specify a specific version if needed)
RUN corepack prepare pnpm@latest --activate

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3333
CMD ["pnpm", "start:prod"]
