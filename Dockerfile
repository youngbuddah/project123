FROM node:18
WORKDIR /app
COPY package.json .
RUN npm install
RUN chmod -R +x node_modules/.bin
COPY . .
EXPOSE 3000
CMD ["node","app.js"]
