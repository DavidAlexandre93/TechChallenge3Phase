import request from "supertest";
import app from "../app";
import User from "../models/User";
import Post from "../models/Post";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "testsecret";

async function criarUsuario(role: "TEACHER" | "STUDENT") {
  const hashed = await bcrypt.hash("senha123", 10);

  return User.create({
    name: role === "TEACHER" ? "Professor" : "Aluno",
    email: `${role.toLowerCase()}@test.com`,
    password: hashed,
    role
  });
}

function gerarToken(user: any) {
  return jwt.sign(
    { id: user._id, name: user.name, role: user.role },
    SECRET,
    { expiresIn: "8h" }
  );
}

describe("Posts API", () => {
  let teacher: any;
  let student: any;
  let teacherToken: string;
  let studentToken: string;

  beforeEach(async () => {
    teacher = await criarUsuario("TEACHER");
    student = await criarUsuario("STUDENT");

    teacherToken = gerarToken(teacher);
    studentToken = gerarToken(student);
  });

  it("deve listar posts", async () => {
    await Post.create({
      title: "Post 1",
      content: "Conteúdo",
      author: "Professor",
      status: "publicado",
      publicationDate: new Date()
    });

    const res = await request(app).get("/posts");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it("deve obter um único post", async () => {
    const post = await Post.create({
      title: "Post Único",
      content: "Teste",
      author: "Professor",
      status: "publicado",
      publicationDate: new Date()
    });

    const res = await request(app).get(`/posts/${post._id}`);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Post Único");
  });

  it("STUDENT não deve criar posts", async () => {
    const res = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        title: "Novo Post",
        content: "Teste"
      });

    expect(res.status).toBe(403);
  });

  it("TEACHER deve criar posts", async () => {
    const res = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        title: "Criado pelo Professor",
        content: "Conteúdo"
      });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Criado pelo Professor");
  });

  it("TEACHER deve editar posts", async () => {
    const post = await Post.create({
      title: "Editável",
      content: "Teste",
      author: "Professor",
      status: "publicado",
      publicationDate: new Date()
    });

    const res = await request(app)
      .put(`/posts/${post._id}`)
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({ title: "Alterado" });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Alterado");
  });

  it("TEACHER deve realizar soft delete", async () => {
    const post = await Post.create({
      title: "Para deletar",
      content: "Teste",
      author: "Professor",
      status: "publicado",
      publicationDate: new Date()
    });

    const res = await request(app)
      .delete(`/posts/${post._id}`)
      .set("Authorization", `Bearer ${teacherToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Post deletado");

    const atualizado = await Post.findById(post._id);
    expect(atualizado?.status).toBe("deletado");
    expect(atualizado?.publicationDate).toBe(null);
  });
});
