FROM node:18.2.0

WORKDIR /usr/app

COPY package.json ./

RUN npm install
RUN npm i -g vite

COPY . .

EXPOSE 8080
CMD ["vite", "dev"]
