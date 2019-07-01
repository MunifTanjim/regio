FROM node:10.15-slim AS frontend

ENV NODE_ENV=production NODE_PATH=src

WORKDIR /app

COPY ./frontend/package*.json ./
RUN npm install --production

COPY ./frontend/ ./

RUN npm run build

FROM nginx:1.15.12-alpine

COPY --from=frontend /app/build /var/www/frontend

RUN rm /etc/nginx/conf.d/default.conf

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/conf.d /etc/nginx/conf.d
COPY ./nginx/conf.extra.d /etc/nginx/conf.extra.d
