# syntax=docker/dockerfile:1

# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies (use lockfile for reproducible builds)
COPY package.json package-lock.json ./
RUN npm ci

# Build the Vite app
COPY . .
RUN npm run build

# --- Serve stage ---
FROM nginx:1.27-alpine AS serve

# SPA-aware nginx config (history fallback + asset caching)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static build output
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
