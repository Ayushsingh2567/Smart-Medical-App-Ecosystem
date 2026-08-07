# Multi-stage Dockerfile for Google Cloud Run
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Copy production build outputs and package.json
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
RUN npm install --only=production

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "dist/server.cjs"]
