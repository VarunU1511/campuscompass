# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY ../campuscompass/back/package*.json ./
RUN npm ci --only=production

# Runtime stage
FROM node:18-alpine

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

WORKDIR /app

# Copy from build stage
COPY --from=build /app/node_modules ./node_modules
COPY ../campuscompass/back .

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]