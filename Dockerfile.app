FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

COPY ./dist ./dist

CMD ["npm", "run", "start"]

ENV PORT 4000

EXPOSE $PORT