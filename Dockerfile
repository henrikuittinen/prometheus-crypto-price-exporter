FROM node as builder
WORKDIR /usr/src/app
COPY index.js .
COPY package.json .
RUN npm install

FROM node:alpine
USER node
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app .
CMD ["node", "index.js"]
EXPOSE 3000