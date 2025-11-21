# Stage 1: build
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY .npmrc ./
RUN npm cache clean --force
RUN npm install --legacy-peer-deps --silent
RUN npm rebuild @swc/core

COPY . .

RUN npm run build

# Stage 2: production
FROM node:20-alpine

WORKDIR /usr/src/app

RUN npm install -g serve

COPY --from=builder /usr/src/app/dist ./dist
COPY package.json ./.npmrc ./

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
