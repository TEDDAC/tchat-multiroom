FROM node:20-alpine

COPY server.js index.html package.json /chat/

WORKDIR /chat

RUN npm install

EXPOSE 3000

ENTRYPOINT ["node", "server.js"]