# Use the official nginx image as base
FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Copy the main application files
COPY index.html ./
COPY manifest.json ./
COPY service-worker.js ./
COPY icon-192x192.png ./
COPY icon-512x512.png ./

# Copy the docs directory (main app files)
COPY docs/ ./

# Copy any additional static assets
COPY *.png ./
COPY *.html ./

# Copy nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 (required for Cloud Run)
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
