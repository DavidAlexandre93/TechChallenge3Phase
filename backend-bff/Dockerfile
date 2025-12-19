FROM node:22-alpine AS builder

WORKDIR /app

RUN apk update && apk upgrade && rm -rf /var/cache/apk/*

# --- TRUQUE NOVO: Atualiza o próprio npm global para evitar CVEs internas dele ---
RUN npm install -g npm@latest

COPY package*.json ./
COPY tsconfig.json ./

# Instala dependências respeitando o novo package-lock gerado no Passo 1
RUN npm ci

COPY . .

RUN npm run build

# Remove dependências de dev antes de passar para frente
RUN npm prune --production

# ------------------------------------------------------------------

FROM node:22-alpine

WORKDIR /app

RUN apk update && apk upgrade && rm -rf /var/cache/apk/*

# --- SEGURANÇA FINAL: Garante que o npm de produção também esteja atualizado ---
RUN npm install -g npm@latest && npm cache clean --force

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

USER node

EXPOSE 4000

CMD ["npm", "start"]