# syntax=docker/dockerfile:1
FROM node:20-alpine
WORKDIR /app

COPY package.json ./
# No lockfile committed for the tiny service; install at build time.
RUN npm install --omit=dev

COPY . .

# Subscriptions persist here — mount a Dokploy volume at /app/data.
ENV DATA_DIR=/app/data
ENV PORT=8080
EXPOSE 8080

CMD ["node", "index.js"]
