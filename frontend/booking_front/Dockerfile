# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application with environment variables
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=http://${REACT_APP_API_URL}
ARG REACT_APP_WS_URL
ENV REACT_APP_WS_URL=ws://${REACT_APP_WS_URL}

# Build with error checking
RUN npm run build || (echo "Build failed" && exit 1)

# Verify build output
RUN ls -la /app/build || (echo "Build directory not found" && exit 1)

# Production stage
FROM nginx:alpine

# Install wget for healthcheck and envsubst for environment variable substitution
RUN apk add --no-cache wget gettext

# Copy built assets from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx with environment variable substitution
CMD ["/bin/sh", "-c", "envsubst '${API_URL}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"] 