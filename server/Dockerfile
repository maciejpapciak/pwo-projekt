FROM node:14 AS builder
WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY . .
COPY .env.production .env
RUN npx prisma generate
RUN yarn build

FROM node:14 AS dev
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/yarn.lock ./
COPY --from=builder /usr/src/app/dist ./dist
ENV NODE_ENV production
EXPOSE 8080
CMD ["node", "dist/index.js"]
USER node