const dbName = process.env.MONGO_INITDB_DATABASE || 'techchallenge3';
const db = db.getSiblingDB(dbName);

// 1) Validador do schema da coleção "posts"
db.createCollection('posts', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'content', 'author', 'status'],
      additionalProperties: true,
      properties: {
        _id: { bsonType: 'objectId' },
        title: { bsonType: 'string', description: 'Título é obrigatório' },
        content: { bsonType: 'string', description: 'Conteúdo é obrigatório' },
        author: { bsonType: 'string', description: 'Autor é obrigatório' },
        status: {
          enum: ['publicado', 'rascunho', 'deletado'],
          description: "Status deve ser 'publicado' | 'rascunho' | 'deletado'",
        },
        publicationDate: {
          bsonType: ['date', 'null'],
          description: 'Data em que o post foi (ou será) publicado',
        },
        createdAt: { bsonType: ['date'], description: 'Criado em' },
        updatedAt: { bsonType: ['date'], description: 'Atualizado em' },
      },
    },
  },
});

// 2) Índices úteis (busca/ordenadores do seu controller)
db.posts.createIndex({ status: 1, publicationDate: -1 });
db.posts.createIndex({ createdAt: -1 });
db.posts.createIndex({ author: 1 });
db.posts.createIndex({ title: 'text', content: 'text' }); // opcional: $text

// 3) Seeds (dados iniciais)
const now = new Date();
const days = (n) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000);

db.posts.insertMany([
  {
    _id: ObjectId('652111111111111111111111'),
    title: 'Arquitetura da Plataforma TechBlog',
    content:
      'Neste artigo apresentamos a arquitetura da plataforma TechBlog, explicando como frontend, backend e banco de dados se comunicam de forma segura. Também abordamos o uso de Docker, API REST e autenticação via JWT.',
    author: 'Equipe Acadêmica',
    status: 'publicado',
    publicationDate: days(-12),
    createdAt: days(-13),
    updatedAt: days(-12),
  },
  {
    _id: ObjectId('652222222222222222222222'),
    title: 'Boas Práticas no Desenvolvimento Full Stack',
    content:
      'Um guia prático sobre boas práticas no desenvolvimento full stack, incluindo organização de pastas, separação de responsabilidades, controle de acesso e padronização de código.',
    author: 'George Teotônio',
    status: 'publicado',
    publicationDate: now,
    createdAt: days(-2),
    updatedAt: now,
  },
  {
    _id: ObjectId('652333333333333333333333'),
    title: 'Próximos Passos do Projeto Tech Challenge',
    content:
      'Este post apresenta os próximos passos planejados para a evolução do projeto, como testes automatizados, melhorias na experiência do usuário e novas funcionalidades administrativas.',
    author: 'Equipe Acadêmica',
    status: 'rascunho',
    publicationDate: null,
    createdAt: days(-1),
    updatedAt: days(-1),
  },
  {
    _id: ObjectId('652444444444444444444444'),
    title: 'Autenticação e Controle de Acesso com JWT',
    content:
      'Artigo em elaboração sobre autenticação baseada em JWT, explicando como proteger rotas sensíveis, diferenciar permissões por perfil e garantir segurança em APIs REST.',
    author: 'Herik Ribeiro',
    status: 'publicado',
    publicationDate: days(-2),
    createdAt: days(-3),
    updatedAt: days(-2),
  },
  {
    _id: ObjectId('652555555555555555555555'),
    title: 'Experimentos Iniciais com Banco de Dados',
    content:
      'Post utilizado em fases iniciais do projeto para testes de conexão com o banco de dados. Este conteúdo foi posteriormente substituído por uma abordagem mais robusta.',
    author: 'Herik Ribeiro',
    status: 'deletado',
    publicationDate: null,
    createdAt: days(-25),
    updatedAt: days(-20),
  },
  {
    _id: ObjectId('652666666666666666666666'),
    title: 'Construindo uma API REST com Node.js e Express',
    content:
      'Neste artigo mostramos como construir uma API REST utilizando Node.js e Express, abordando rotas, middlewares, conexão com MongoDB e organização do projeto.',
    author: 'George Teotônio',
    status: 'rascunho',
    publicationDate: null,
    createdAt: days(-13),
    updatedAt: days(-6),
  },
]);

db.createCollection("users");

db.users.insertOne({
  email: "jubileu@professor.com",
  password: "$2b$10$sTkM5WrRmucB4AENp.NC7ujTUS7ow3noIEWw36kvazlxbPG7iwUzu",
  role: "TEACHER",
});

print(`[database-init.js] Base '${dbName}' inicializada com coleção 'posts', índices e seeds.`);
