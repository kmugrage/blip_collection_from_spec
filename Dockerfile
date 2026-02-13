# Multi-stage build for Technology Radar Blip Submission

# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build frontend
RUN npm run build:client

# Stage 2: Build backend
FROM node:20-alpine AS backend-builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies (including devDependencies for build)
RUN npm ci

# Copy server source
COPY server ./server

# Build backend
RUN npm run build:server

# Stage 3: Production image
FROM node:20-alpine

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built frontend from frontend-builder
COPY --from=frontend-builder /app/dist ./dist/client

# Copy built backend from backend-builder
COPY --from=backend-builder /app/dist/server ./dist/server

# Copy radar data
COPY data/radar ./data/radar

# Create data directory for submissions
RUN mkdir -p /app/data && chown -R node:node /app/data

# Switch to non-root user
USER node

# Expose port
EXPOSE 3001

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "dist/server/index.js"]
