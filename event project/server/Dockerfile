FROM node:16-alpine AS server

WORKDIR /app

COPY ./server/package.json ./server/package-lock.json .

RUN npm install 

COPY ./server/ .

EXPOSE 5000

CMD ["node","index.js"]