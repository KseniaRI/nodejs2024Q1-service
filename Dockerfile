FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci && npm cache clean --force

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=build /app .

CMD ["npm", "run", "start:migrate"]