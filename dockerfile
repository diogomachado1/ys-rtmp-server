
FROM node:alpine

LABEL version="0.1.0"

COPY ./ /ys-rtmp-server

WORKDIR /ys-rtmp-server

RUN apk add  --no-cache ffmpeg

RUN npm set progress=false && \
  npm i --silent --production

CMD NODE_ENV=production node server.js
