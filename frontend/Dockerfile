# --- etapa de build ---
FROM node:22-alpine AS builder

WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./

RUN npm ci
COPY . .
RUN npm run build

# --- etapa final: nginx ---
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf \
    && apk update && apk upgrade \
    && apk add --no-cache curl  # só se precisar

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]