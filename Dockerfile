# syntax=docker/dockerfile:1

# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies (use lockfile for reproducible builds)
COPY package.json package-lock.json ./
RUN npm ci

# Build the Vite app
COPY . .
# GA4 Measurement ID is inlined at build time (Vite). It is a public client-side
# identifier (shipped in the browser bundle), not a secret, so the production
# default lives here. Override per-build with:
#   docker build --build-arg VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX .
ARG VITE_GA_MEASUREMENT_ID=G-9EZPKMJPPL
ENV VITE_GA_MEASUREMENT_ID=$VITE_GA_MEASUREMENT_ID
RUN npm run build

# --- Serve stage ---
FROM nginx:1.27-alpine AS serve

# SPA-aware nginx config (history fallback + asset caching)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static build output
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
