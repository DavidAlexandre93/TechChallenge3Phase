FROM node:22

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4000

ENTRYPOINT ["npm"]

CMD ["start"]