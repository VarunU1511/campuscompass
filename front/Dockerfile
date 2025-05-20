FROM node:18-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY ../campuscompass/front/package*.json ./
RUN npm ci

# Copy source code
COPY ../campuscompass/front .

# Set environment variables for production build
ENV REACT_APP_API_URL=https://api.campuscompass.com

# Build the application
RUN npm run build

# Runtime stage with Nginx
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]