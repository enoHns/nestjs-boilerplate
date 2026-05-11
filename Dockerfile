
FROM node:22-alpine AS base
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

FROM base AS development

RUN npm install

COPY . .
RUN npx prisma generate

EXPOSE 3000
ENTRYPOINT ["sh", "docker/entrypoint.sh"]
CMD ["npm", "run", "start:dev"]

FROM base AS builder

RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist     ./dist
COPY --from=builder /app/prisma   ./prisma

RUN npx prisma generate

COPY docker/entrypoint.sh ./docker/entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["sh", "docker/entrypoint.sh"]
CMD ["node", "dist/main"]
