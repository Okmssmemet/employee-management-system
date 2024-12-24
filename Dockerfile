FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV=production

RUN npm run build

RUN npm run migrate

CMD ["npm", "start"]

EXPOSE 3000
