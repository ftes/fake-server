FROM node:9-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY src/ ./src
COPY .neutrinorc.js ./.neutrinorc.js
RUN npm run build

VOLUME /usr/src/app/config

EXPOSE 1337
CMD [ "node", "./build/index", "-c", "./config" ]