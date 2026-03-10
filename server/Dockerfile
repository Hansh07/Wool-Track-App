FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY src/ ./src/
COPY .env.example ./.env.example
RUN mkdir -p logs uploads
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:5000/health || exit 1
CMD ["node", "src/server.js"]
