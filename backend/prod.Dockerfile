FROM node:10.15-slim

RUN npm install -g pm2

ENV NODE_ENV=production NODE_PATH=.

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY ./ ./

EXPOSE 3000

ENTRYPOINT ["pm2-runtime", "start", "configs/ecosystem.config.js"]
