FROM node:18 AS builder

WORKDIR /app

# 👇 recebe variável em build time
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./

RUN npm install

COPY . .

RUN npm run build

# --- server final nginx ---
FROM nginx:alpine

# Remove config default
RUN rm /etc/nginx/conf.d/default.conf

# Copia nosso nginx.conf customizado
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia o build do frontend
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
