FROM node:14-alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
ENV NODE_ENV production
COPY app.js ./
COPY build/ ./
CMD ["npm", "run"]
