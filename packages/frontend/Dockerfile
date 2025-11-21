FROM node:20-alpine as builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY .npmrc ./
RUN npm ci --legacy-peer-deps --silent

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./
COPY .npmrc ./

RUN npm ci --only=production --legacy-peer-deps --silent

EXPOSE 3000
CMD ["npm", "start"]
