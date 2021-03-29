FROM node:14-alpine
ENV NODE_ENV production
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
RUN rm -rf public/ src/ package.json package-lock.json
CMD ["node", "app.js"]
