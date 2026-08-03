FROM node:20-slim AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma.config.ts tsconfig.json openapi.json ./
COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src
RUN npm run build


FROM node:20-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

COPY --from=builder /app/generated ./generated
COPY --from=builder /app/src ./src
COPY --from=builder /app/openapi.json ./openapi.json

EXPOSE 3001
CMD ["npx", "tsx", "src/server.ts"]
