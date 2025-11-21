FROM node:20

ENV HOME=/usr/src/app
WORKDIR $HOME

COPY package*.json ./
COPY .npmrc ./
COPY package-lock.json ./

RUN rm -rf node_modules package-lock.json
RUN npm cache clean --force
RUN npm install --legacy-peer-deps --silent
RUN npm rebuild @swc/core

RUN npm install -g serve

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
