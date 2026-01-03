# Documentação do Sistema

## Introdução
Este documento resume a arquitetura do TechBlog, descreve como executar e utilizar a aplicação e registra os principais desafios e aprendizados do time ao longo do desenvolvimento. O objetivo é servir como referência rápida para avaliadores e para qualquer pessoa que precise compreender ou evoluir o projeto.

## Arquitetura do Sistema
### Visão Geral
A solução segue o padrão _cliente-servidor_ com separação clara de responsabilidades:

```
[ React + Vite (SPA) ] -> [ BFF Node/Express ] -> [ MongoDB ]
```

- **Frontend (SPA)**: interface em React + TypeScript, roteada com React Router e estilizada com Styled Components. O estado global é gerenciado por Context API (auth e busca).
- **Backend BFF**: API REST em Node.js + Express + TypeScript. Centraliza regras de negócio, autenticação JWT e autorização por perfil, expondo rotas para autenticação e CRUD de posts.
- **Banco de Dados**: MongoDB com esquemas validados via Mongoose. Seeds inicializam usuários e posts (publicados, rascunhos e deletados) para permitir testes imediatos.
- **Infra & Observabilidade**: Docker Compose orquestra API, frontend e Mongo. Pipeline CI/CD no GitHub Actions executa testes (backend e frontend), builds e validação com containers. Health check exposto em `/health`.

### Backend (BFF)
- Estrutura organizada por responsabilidade (`routes`, `controllers`, `models`, `middleware`, `tests`).
- Middlewares de autenticação e autorização verificam tokens JWT e perfis (`TEACHER`/`STUDENT`).
- Validação de entrada e mapeamento de erros padronizam respostas e mantêm o domínio protegido.
- Testes automatizados com Jest + Supertest + mongodb-memory-server garantem cobertura sem depender de banco externo.

### Frontend (SPA)
- Páginas principais: Home (listagem pública), Login, Dashboard (professores), Create/Edit Post e PostPage (detalhe).
- **Contexts**: `AuthContext` mantém sessão JWT e `SearchContext` centraliza filtros de busca e ordenação.
- **Componentes reutilizáveis**: Header, Footer, Search e rotas privadas (`PrivateRoute`) facilitam consistência de UI e controle de acesso.
- Integração com a API via camada `api/` (Axios) com interceptadores para anexar token e tratar erros comuns.

### Banco de Dados e Dados Iniciais
- Esquemas Mongoose para `User` e `Post`, com índices para busca/ordenar e validações de domínio (status, datas de publicação, autor).
- Seeds em `docker/mongo-init/database-init.js` criam usuário professor padrão e posts em diferentes estados (publicado, rascunho, deletado), viabilizando testes de fluxo completo.

### Infraestrutura e Operação
- **Docker Compose** sobe MongoDB, API e frontend com redes internas e variáveis injetadas via `.env`/`secrets`.
- Scripts do Makefile e dos `package.json` aceleram tarefas de desenvolvimento (dev, build, test) em cada módulo.
- Pipeline CI/CD replica o fluxo local: instala dependências, roda testes, builda projetos e valida containers com health checks do backend e disponibilidade do frontend.

## Uso da Aplicação
### Pré-requisitos
- Docker + Docker Compose (recomendado) ou Node.js v20+ e npm se optar por execução local.
- Arquivo `.env` na raiz baseado em `.env.example` (porta da API, URI do Mongo, segredo JWT e URL pública do frontend).

### Execução com Docker (recomendada)
```bash
docker compose up --build
```
- Frontend: http://localhost:5173
- Backend: http://localhost:4000/posts
- Health: http://localhost:4000/health

### Execução Local (sem containers)
1. Instale dependências na raiz (monorepo simplificado):
   ```bash
   npm install --prefix backend-bff
   npm install --prefix frontend
   ```
2. Inicie o MongoDB local ou ajuste `MONGO_URI` no `.env`.
3. Rode os serviços em terminais separados:
   ```bash
   npm run dev --prefix backend-bff
   npm run dev --prefix frontend
   ```
4. Aponte o frontend para a URL da API via `VITE_API_URL`.

### Fluxos de Uso
- **Aluno**: acessa a Home e visualiza apenas posts publicados cujo `publicationDate` é menor ou igual à data atual. Pode buscar por autor, título ou texto.
- **Professor (dashboard)**: após login, cria, edita, publica/agenda, restaura ou deleta posts (soft delete). Visualiza rascunhos e itens deletados para revisão.
- **Autenticação**: token JWT persistido no storage e anexado automaticamente às requisições autenticadas.

### Credenciais de Avaliação
Usuário professor pré-configurado:
- Login: `jubileu@professor.com`
- Senha: `s&nha`

## Experiências, Desafios e Aprendizados
- **Modelagem de domínio**: separar estados de post (`rascunho`, `publicado`, `deletado`) evitou exclusões físicas e permitiu recuperar conteúdos. Foi necessário ajustar validações de data de publicação para evitar exposição antecipada.
- **Autenticação/Autorização**: padronizar o middleware JWT e a verificação de perfil no backend simplificou o `PrivateRoute` no frontend. Resolver CORS e sincronizar expiração de token exigiu ajustes na camada `api/` (interceptadores e refresh de sessão via contexto).
- **Integração API ⇄ SPA**: alinhar contratos (payloads e status HTTP) reduziu lógica de transformação. Testes de rota com Supertest ajudaram a validar cenários de erro antes de conectar o frontend.
- **Dados e seeds**: a criação de seeds realistas acelerou testes manuais e pipelines. Houve reiterações para garantir compatibilidade entre ambientes Docker e execução local (montagem de volumes e inicialização idempotente do Mongo).
- **Testes e qualidade**: uso de `mongodb-memory-server` no backend e Vitest/RTL no frontend aumentou confiança em fluxos críticos (auth, CRUD, busca). O pipeline CI/CD bloqueia regressões com builds e health checks automatizados.
- **UX e produtividade**: componentes de busca, filtros e pré-visualização de status facilitaram o trabalho do professor; a Context API evitou prop drilling e simplificou a manutenção.
- **Infra e CI/CD**: containerizar tudo logo no início reduziu diferenças entre máquinas. O pipeline no GitHub Actions foi ajustado para reutilizar caches npm e validar a pilha completa com Docker Compose.

---

Este documento deve ser mantido junto do código para orientar novos contribuidores e avaliadores sobre decisões arquiteturais, formas de uso e histórico de aprendizados.
