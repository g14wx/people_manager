FROM node:18-alpine AS base
WORKDIR /usr/src/app
RUN apk add --no-cache openssl tini
ENTRYPOINT ["/sbin/tini", "--"]


FROM base AS dependencies
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma/
COPY tsconfig*.json ./
COPY jest.config.ts ./
COPY src ./src
COPY tests ./tests
RUN npx prisma generate


FROM base AS builder
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=dependencies /usr/src/app/prisma ./prisma
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src
RUN npm run build
RUN npm prune --production


FROM base AS production
ENV NODE_ENV=production
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY package.json .
EXPOSE 8080
CMD [ "node", "dist/main.js" ]