FROM node:14-alpine
WORKDIR /app
ENV NODE_ENV production
COPY . .
RUN npm install
RUN npm cache clean --force
RUN npm build
CMD ["node", "app.js"]
