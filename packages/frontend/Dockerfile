FROM node:20-alpine

ENV HOME=/usr/src/app
WORKDIR $HOME

COPY package*.json ./
COPY .npmrc ./
COPY package-lock.json ./
RUN npm ci --legacy-peer-deps --silent

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
