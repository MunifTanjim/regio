FROM node:10.15-slim

ENV NODE_ENV=development NODE_PATH=.

WORKDIR /app

EXPOSE 3000
VOLUME ["/app"]

ENTRYPOINT ["npx", "nodemon", "server.js"]
