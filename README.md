# TechBlog — Tech Challenge 3

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/Express-000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

Plataforma educacional full stack desenvolvida como tarefa do Tech Challenge 3, permitindo que professores gerenciem conteúdos (criação, edição e exclusão de posts) enquanto alunos visualizem apenas posts publicados.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Principais Recursos](#principais-recursos)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Infraestrutura](#infraestrutura)
- [Execução do Projeto](#execução-do-projeto)
  - [Variáveis de Ambiente](#variáveis-de-ambiente)
  - [Executando com Docker (recomendado)](#executando-com-docker-recomendado)
  - [Executando localmente](#executando-localmente)
  - [Bancos de Dados e Seeds](#banco-de-dados-e-seeds)
  - [Autenticação e Autorização](#autenticação-e-autorização)
    - [Credenciais de acesso](#credenciais-de-acesso)
  - [Uso da Aplicação](#uso-da-aplicação)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Testes Automatizados](#testes-automatizados)
- [CI/CD](#cicd)
  - [Etapas do Pipeline](#etapas-do-pipeline)
  - [Variáveis de Ambiente](#variáveis-de-ambiente)
  - [Benefícios da Estratégia](#benefícios-da-estratégia)
  - [Possíveis Extensões Futuras](#possíveis-extensões-futuras)
- [Boas Práticas & Segurança](#boas-práticas-e-segurança)
- [Documentação do Sistema](#documentação-do-sistema)
  - [Arquitetura do Sistema](#arquitetura-do-sistema)
  - [Execução da Aplicação](#execução-da-aplicação)
    - [Perfil administrativo](#perfil-administrativo)
  - [Experiências e Desafios Enfrentados](#experiências-e-desafios-enfrentados)
  - [Conclusão](#conclusão)
- [Autores](#autores)

---

## Visão Geral

O TechBlog é uma aplicação web completa, composta por um _frontend SPA_ desenvolvido em **React + TypeScript**, utilizando **Vite** e **Styled Components**, e por uma _API REST_ desenvolvida em **Node.js + Express + TypeScript**, estruturada no padrão _BFF (Backend For Frontend)_, com **MongoDB** integrado via **Mongoose**, projetada para simular um ambiente educacional real.

A aplicação foi pensada para permitir que avaliadores (professores) consigam executar e testar todo o sistema _localmente_, sem necessidade de acesso a credenciais reais de banco de dados, utilizando **Docker**, seeds automáticos e variáveis de ambiente seguras, e possui pipeline de **CI/CD** via **GitHub Actions**.

---

## Principais Recursos

- **CRUD de posts** (criar, listar, atualizar, soft delete).
- **Login** autenticado via **JWT**.
- **Perfis**:
  - **Professores**: podem criar `rascunho`, publicar/agendar (`publicado` + `publicationDate`), ver inclusive **deletados**.
  - **Alunos**: visualizam **apenas** posts `publicados` com `publicationDate ≤ agora`.
- **Busca/Filtragem/Ordenação** (autor, título ou texto livre).
- **Soft delete** (status `deletado`, não remove fisicamente).

---

## Arquitetura

O projeto segue uma arquitetura _cliente-servidor_, com clara separação de responsabilidades:

~~~
[ React + Vite ] --> [ API REST - Node/Express ] --> [ MongoDB ]
~~~

- **Frontend**: _SPA_ em **React** consumindo a _API_ via HTTP.
- **Backend (BFF)**: responsável por regras de negócio, autenticação e segurança.
- **Banco de Dados**: **MongoDB** com schema validado e dados iniciais (seeds).

Toda a infraestrutura pode ser inicializada via **Docker Compose**.

---

## Tecnologias

### Frontend

- React + Vite
- TypeScript
- Styled Components
- React Router DOM
- Context API (Auth e Search)

### Backend

- Node.js
- Express
- TypeScript
- MongoDB + Mongoose
- JWT para autenticação

### Infraestrutura

- Docker e Docker Compose
- Scripts de seed automáticos do MongoDB

---

## Execução do Projeto

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz, conforme o `.env.example`:

```bash
PORT=4000
MONGO_URI=mongodb://mongo:27017/techchallenge3
JWT_SECRET=change-me
VITE_API_URL=http://localhost:4000
MONGO_INITDB_DATABASE=techchallenge3
```

---

### Executando com Docker (recomendado)

1. Suba os serviços:

```bash
docker compose up --build
```

2. Endpoints padrão:

- **Frontend**: <http://localhost:5173>

- **Backend (API)**: <http://localhost:4000/posts>

- **Health**: <http://localhost:4000/health>

O **MongoDB** 

O `docker-compose.yml` também inclui o serviço do **MongoDB**, o qual é inicializado automaticamente com coleções, índices e dados ilustrativos, por meio do script de seed (arquivo `docker/mongo-init/database-init.js` montado no contêiner do _Mongo_).

---

### Executando localmente

Instale dependências:

```bash
npm install
```

Ambiente de desenvolvimento (TS direto):

```bash
npm run dev
```

> Observação: para execução local sem **Docker**, é necessário um **MongoDB** ativo ou ajustes no `.env`.

---

### Banco de Dados e Seeds

O banco utiliza:

- _Schema validation_ via **MongoDB**
- Índices para busca e ordenação
- Dados iniciais (_seeds_) com:
    - Posts publicados
    - Rascunhos
    - Posts deletados

Isso permite avaliar corretamente as regras de visibilidade da aplicação.

---

### Autenticação e Autorização

- Autenticação baseada em **JWT**
- Senhas armazenadas de forma segura com _hash (bcrypt)_
- Middleware de autorização por perfil (_TEACHER_ / _STUDENT_)
- Rotas protegidas para criação, edição e exclusão de posts

As credenciais do banco _não são expostas ao frontend_.

#### Credenciais de acesso

Para fins de avaliação do projeto, está disponível um usuário previamente cadastrado com perfil de **TEACHER**, permitindo acesso completo ao dashboard administrativo:

- **Login:** jubileu@professor.com
- **Senha:** s&nha
- **Role:** TEACHER

Essas credenciais permitem testar todas as funcionalidades restritas da aplicação, incluindo criação, edição e exclusão de posts.

---

### Uso da Aplicação

- A página inicial exibe os posts publicados
- Professores autenticados visualizam o dashboard completo
- Busca dinâmica integrada à listagem
- Datas futuras não aparecem para alunos

---

## Estrutura de Pastas

```bash
.
├─ .github/workflows/
│  └─ ci.yml                 # pipeline CI/CD
├─ backend-bff/
│  ├─ src/
│  │   ├─ middleware/
│  │   │  └─ auth.ts
│  │   ├─ models/
│  │   │  ├─ Post.ts
│  │   │  └─ User.ts
│  │   ├─ routes/
│  │   │  ├─ auth.ts
│  │   │  └─ posts.ts
│  │   ├─ tests/
│  │   │  ├─ auth.test.ts
│  │   │  ├─ middleware.test.ts
│  │   │  ├─ posts.test.ts
│  │   │  └─ setupTest.ts
│  │   ├─ app.ts
│  │   └─ server.ts
│  ├─ .dockerignore
│  ├─ .env.test
│  ├─ .gitignore
│  ├─ Dockerfile
│  ├─ jest.config.js
│  ├─ package-lock.json
│  ├─ package.json
│  └─ tsconfig.json
├─ docker/mongo-init/
│  └─ database-init.js      # seed inicial do Mongo (montado no contêiner)
├─ frontend/
│  ├─ public/
│  │  └─ book-open-thin.svg
│  ├─ src/
│  │  ├─ api/
│  │  │  ├─ api.ts
│  │  │  ├─ authService.ts
│  │  │  └─ postService.ts
│  │  ├─ components/
│  │  │  ├─ Footer.tsx
│  │  │  ├─ Header.tsx
│  │  │  ├─ PrivateRoute.tsx
│  │  │  └─ Search.tsx
│  │  ├─ context/
│  │  │  ├─ AuthContext.tsx
│  │  │  ├─ AuthProvider.tsx
│  │  │  ├─ SearchContext.tsx
│  │  │  └─ SearchProvider.tsx
│  │  ├─ hooks/
│  │  │  ├─ useAuth.ts
│  │  │  └─ useSearch.ts
│  │  ├─ layout/
│  │  │  ├─ MainLayout.tsx
│  │  │  └─ MainLayoutWithHeader.tsx
│  │  ├─ models/
│  │  │  └─ postModel.ts
│  │  ├─ pages/
│  │  │  ├─ CreatePost.tsx
│  │  │  ├─ Dashboard.tsx
│  │  │  ├─ EditPost.tsx
│  │  │  ├─ Home.tsx
│  │  │  ├─ Login.tsx
│  │  │  └─ PostPage.tsx
│  │  ├─ styles/
│  │  │  ├─ GlobalStyle.ts
│  │  │  ├─ style.d.ts
│  │  │  └─ theme.ts
│  │  ├─ tests/
│  │  │  ├─ api/
│  │  │  │  ├─ api.test.ts
│  │  │  │  ├─ authService.test.ts
│  │  │  │  └─ postService.test.ts
│  │  │  ├─ components/
│  │  │  │  ├─ Header.test.tsx
│  │  │  │  ├─ PrivateRoute.test.tsx
│  │  │  │  └─ SearchBar.test.tsx
│  │  │  ├─ pages/
│  │  │  │  ├─ CratePost.test.tsx
│  │  │  │  ├─ Dashboard.test.tsx
│  │  │  │  ├─ EditPost.test.tsx
│  │  │  │  ├─ Home.test.tsx
│  │  │  │  ├─ Login.test.tsx
│  │  │  │  └─ PostPage.test.tsx
│  │  │  └─ setupTest.ts
│  │  ├─ App.css
│  │  ├─ App.tsx
│  │  ├─ index.css
│  │  ├─ main.tsx
│  │  └─ App.tsx
│  ├─ .dockerignore
│  ├─ .gitignore
│  ├─ Dockerfile
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ nginx.conf
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ .env
├─ .env.example
├─ .gitignore
├─ docker-compose.yml
├─ Makefile
└─ README.md
```

---

## Testes Automatizados

O _backend_ conta com testes automatizados utilizando:

- **Jest**
- **Supertest**
- _mongodb-memory-server_

Isso garante que a API possa ser testada _sem dependência de banco real_.

Para rodar os testes, execute:

```bash
npm test
# ou
npm run test:watch
# cobertura
npm run test:coverage
```

---

## CI/CD

Pipeline automatizado configurado em `.github/workflows/ci.yml`, responsável por validar continuamente o **backend (BFF)** e o **frontend SPA**, garantindo qualidade, estabilidade e integração entre as camadas.

### Etapas do Pipeline

- **Checkout do código** a cada `push` ou `pull request` na branch `main`.
- **Setup do ambiente Node.js (v20)** para backend e frontend, com cache de dependências.
- **Backend**
  - Instalação das dependências.
  - Execução dos testes automatizados (**Jest**).
  - Build do projeto TypeScript.
- **Frontend**
  - Instalação das dependências.
  - Execução dos testes automatizados (**Vitest**).
  - Build da aplicação SPA com **Vite**.
- **Docker**
  - Build completo da stack via **Docker Compose**.
  - Subida dos containers para validação de integração.
  - Verificação de saúde do backend via endpoint `/health`.
  - Teste de disponibilidade do frontend via requisição HTTP.
- **Cleanup**
  - Encerramento dos containers e volumes ao final do job, mesmo em caso de falha.

### Variáveis de Ambiente

As variáveis sensíveis são injetadas de forma segura via **GitHub Secrets**, incluindo:

- `MONGO_URI`
- `JWT_SECRET`
- `VITE_API_URL`

Isso garante que o pipeline execute sem expor credenciais no repositório.

### Benefícios da Estratégia

- Validação **end-to-end** (backend + frontend + Docker).
- Detecção precoce de falhas de integração.
- Ambiente de CI próximo ao cenário real de execução.
- Maior confiabilidade para avaliação e evolução do projeto.

### Possíveis Extensões Futuras

- **Lint e Typecheck** (`eslint`, `tsc --noEmit`).
- **Análise de segurança** (`npm audit`, OSSF Scorecard).
- **Validação de contratos** (ex.: OpenAPI).
- **Publicação automática de imagens Docker** em um registry (GHCR).

---

## Boas Práticas e Segurança

- Separação clara de camadas
- Variáveis sensíveis fora do repositório (`.env`, `secrets` no `Actions`).
- Seed controlado para ambientes de avaliação
- Soft delete evita perda de dados.
- Código tipado com **TypeScript**

---

## Documentação do Sistema

### Arquitetura do Sistema

A aplicação desenvolvida é uma **API RESTful de blog educacional**, voltada para _interação entre professores e alunos_. Seu objetivo é permitir que professores criem, editem, publiquem e removam postagens, enquanto os alunos acessam apenas conteúdos publicados e disponíveis.

A arquitetura foi projetada para ser modular, escalável e de fácil manutenção, seguindo boas práticas de desenvolvimento em **Node.js + Express + TypeScript**, com persistência de dados em **MongoDB**.

A estrutura de pastas foi organizada por responsabilidade:

- `components/` — componentes reutilizáveis da interface, responsáveis por elementos visuais e funcionais da aplicação;
- `context/` — gerenciamento de estado global e compartilhamento de dados entre componentes por meio da **Context API**;
- `controllers/` — regras de negócio e validações;
- `docker/` — scripts e configurações de inicialização do banco.
- `hooks/` — hooks customizados para encapsular e reutilizar lógica de estado e efeitos;
- `layout/` — componentes estruturais responsáveis pela composição visual das páginas (header, footer, sidebar, etc.);
- `middleware/` — funções intermediárias responsáveis pela **autenticação e autorização de usuários**, validando tokens **JWT** e controlando o acesso às rotas protegidas da aplicação;
- `models/` — definição dos esquemas de dados com **Mongoose**;
- `routes/` — gerenciamento das rotas e endpoints REST;
- `pages/` — páginas da aplicação, representando as rotas e fluxos principais do usuário;
- `styles/` — estilos globais e temas da aplicação, utilizando **Styled Components**;
- `tests/` — testes automatizados de integração com **Jest** e `mongodb-memory-server`;


O **Docker Compose** orquestra tanto o serviço da aplicação quanto o do banco de dados, permitindo replicar facilmente o ambiente em qualquer máquina. Além disso, há uma **pipeline de CI/CD** configurada no **GitHub Actions**, que executa testes automatizados e constrói a imagem Docker em cada commit na branch principal.

---

### Execução da Aplicação

A API pode ser executada de duas formas principais:

1. **Com Docker** (recomendado) — por meio do comando `docker compose up --build`, que inicializa tanto a API quanto o banco MongoDB.

2. **Localmente** — com `npm install` para instalar dependências e `npm run dev` para rodar o servidor em modo desenvolvimento.

As principais variáveis de ambiente são configuradas no arquivo `.env`, incluindo a porta, caminhos de rotas e URIs de conexão do banco.

Após a execução, os endpoints principais ficam disponíveis em:

- **Frontend**: <http://localhost:5173>
- **Backend (API)**: <http://localhost:4000/posts>
- **Health**: <http://localhost:4000/health>

Entre os principais recursos da aplicação estão:
- CRUD completo de postagens (criar, editar e excluir são exclusivos dos professores);
- Diferenciação de acesso entre professores e alunos;
- Soft delete, para preservar o histórico de dados;
- Filtragem e busca textual;
- Testes automatizados e execução independente do banco real.

#### Perfil administrativo

Para ter acesso ao dashboard, um usuário foi previamente cadastrado com perfil de **TEACHER**:

- **Login:** jubileu@professor.com
- **Senha:** s&nha

Essas credenciais permitem testar todas as funcionalidades restritas da aplicação, incluindo criação, edição e exclusão de posts.

---

### Experiências e Desafios Enfrentados

Durante o desenvolvimento, a equipe enfrentou uma série de desafios técnicos e de integração.
Um dos principais foi definir uma arquitetura limpa e escalável, garantindo que a API fosse de fácil manutenção e respeitasse boas práticas como separação de camadas e tipagem forte com **TypeScript**.

Outro ponto importante foi o uso do **Docker**, que inicialmente exigiu ajustes nos volumes e na comunicação entre containers (API ↔ MongoDB). Após a configuração correta, o ambiente tornou-se muito mais previsível e portátil.

Nos testes automatizados, o uso do `mongodb-memory-server` foi essencial para permitir testes de integração sem dependência de banco externo, usando de seed realista.

Por fim, o grupo reconhece que o processo proporcionou aprendizado prático em:

- Integração entre **TypeScript**, **Express** e **MongoDB**;
- Arquitetura full stack;
- Configuração segura de ambiente Docker;
- Versionamento com **Git** e **GitHub**;
- Testes automatizados e boas práticas de **CI/CD**;
- Trabalho colaborativo e organização de tarefas no contexto de desenvolvimento ágil.

---

### Conclusão

O projeto atingiu os objetivos propostos: o TechBlog representa uma aplicação completa, funcional, testada e alinhada com padrões profissionais de desenvolvimento web pronta para implantação.
A combinação entre boas práticas de desenvolvimento, ferramentas modernas e integração contínua garantiu um sistema robusto, de fácil evolução e alinhado com padrões profissionais do mercado.

O sistema foi projetado para ser facilmente avaliado, executado e compreendido, atendendo plenamente aos objetivos do Tech Challenge 3.

---

## Autores

Nome | GitHub
:--- | :---
George Teotônio | <https://github.com/Sithari66>
Herik da Silva Ribeiro | <https://github.com/HerikRibeiro>

Sugestões, melhorias e PRs são muito bem-vindas!
