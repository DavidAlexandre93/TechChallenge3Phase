# Estágio 1: Builder (Instala dependências e compila o código)
# Usamos 'node:22-alpine' pela leveza e velocidade.
FROM node:22-alpine AS builder

WORKDIR /app

# --- 1. Correções de Segurança (CVEs de Alpine/Debian) ---
# Atualiza os pacotes de sistema (apk) para corrigir vulnerabilidades de base (libpng, tar, glibc, etc.).
RUN apk update && apk upgrade && rm -rf /var/cache/apk/*

# --- 2. Instalação de Dependências ---
# COPIA os arquivos de dependência PRIMEIRO (para otimizar o cache do Docker)
# Esta etapa é crucial para que o 'npm ci' encontre o package-lock.json.
COPY package*.json ./
COPY tsconfig.json ./

# Limpa o cache do npm (para resolver a CVE do glob) e instala as dependências.
# O 'npm ci' usa o package-lock.json, que deve estar sincronizado com os 'overrides'
RUN npm cache clean --force && npm ci

# Copia o restante do código-fonte
COPY . .

# Executa a compilação (tsc)
RUN npm run build

# ------------------------------------------------------------------

# Estágio 2: Production (Runtime)
# Imagem de produção mínima, contendo apenas o essencial para rodar o código compilado.
FROM node:22-alpine

# Define o diretório de trabalho.
WORKDIR /app

# A imagem node:22-alpine já tem um usuário 'node' (UID/GID 1000) criado.
# Copiamos os arquivos e rodamos como este usuário não-root (segurança).

# Copia SOMENTE o necessário do estágio 'builder':
# 1. Dependências de produção (node_modules)
# 2. Código compilado (dist)
# 3. package.json e package-lock.json (necessário para "npm start")
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Define o usuário 'node' que já está na imagem base
USER node

EXPOSE 4000

# Execução
CMD ["npm", "start"]