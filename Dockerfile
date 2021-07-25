FROM node:lts-alpine

ENV NODE_ENV=production
WORKDIR /app
COPY package.json package.json
RUN npm i --verbose
EXPOSE 8080
CMD ["npm", "run", "dev"]
