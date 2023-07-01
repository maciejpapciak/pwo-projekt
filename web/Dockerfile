# Stage 1: Build stage
FROM node:16-bookworm-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:16-bookworm-slim AS dev
WORKDIR /app
COPY --from=builder /app/.nuxt  ./.nuxt
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/static ./static
COPY --from=builder /app/package.json .
COPY --from=builder /app/nuxt.config.js .
ENV HOST 0.0.0.0
ENV NUXT_PORT 3000
EXPOSE 3000/tcp
CMD ["npm", "run", "start"]
