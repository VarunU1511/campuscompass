# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY campuscompass/back/package*.json ./
RUN npm ci --only=production

# Runtime stage
FROM node:18-alpine

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copy from build stage
COPY --from=build /app/node_modules ./node_modules
COPY campuscompass/back/ ./

# Change ownership to nodejs user
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js || exit 1

# Start the application
CMD ["node", "server.js"]