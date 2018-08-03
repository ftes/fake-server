FROM node:9-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY src/ ./src
COPY .neutrinorc.js ./.neutrinorc.js
RUN npm run build

EXPOSE 1337
CMD [ "npm", "start", "--", "-c", "./config" ]