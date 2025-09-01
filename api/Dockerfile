# ==============================================================================
# Multi-stage Dockerfile for NestJS API with optimized caching
# ==============================================================================

# Build arguments
ARG NODE_VERSION=18-alpine

# ==============================================================================
# Dependencies stage - Install and cache dependencies
# ==============================================================================
FROM node:${NODE_VERSION} AS deps

RUN apk update && apk upgrade
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copy package files for dependency installation
COPY package.json yarn.lock* ./

# Install all dependencies (including dev dependencies for build)
RUN yarn install --frozen-lockfile --network-timeout 100000

# ==============================================================================
# Builder stage - Build the application
# ==============================================================================
FROM node:${NODE_VERSION} AS builder

RUN apk update && apk upgrade
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copy dependencies from previous stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Generate Prisma client and build the application
RUN yarn prisma:generate
RUN yarn build

# Install only production dependencies
RUN yarn install --frozen-lockfile --production --ignore-scripts && yarn cache clean

# ==============================================================================
# Runtime stage - Final optimized image
# ==============================================================================
FROM node:${NODE_VERSION} AS runner

RUN apk update && apk upgrade
RUN apk add --no-cache dumb-init curl openssl

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Copy package.json for runtime dependencies reference
COPY --chown=nestjs:nodejs package.json ./

# Copy production node_modules from builder
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules

# Copy TypeScript configuration for nest build command
COPY --chown=nestjs:nodejs tsconfig.json nest-cli.json ./

# Copy source code for potential rebuild
COPY --chown=nestjs:nodejs src ./src

# Copy Prisma schema and generated client for migrations
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# Ensure nestjs user can write to dist directory
RUN chown -R nestjs:nodejs /app

# Switch to non-root user
USER nestjs

# Expose the application port
EXPOSE 3001

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Default command
CMD ["node", "dist/main.js"]