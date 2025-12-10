import request from "supertest";
import app from "../app";
import User from "../models/User";
import bcrypt from "bcryptjs";

describe("Auth - Login", () => {
  beforeEach(async () => {
    await User.deleteMany({}); // limpa o banco em cada teste

    const hashed = await bcrypt.hash("senha123", 10);

    await User.create({
      name: "Professor Teste",
      email: "prof@test.com",
      password: hashed,
      role: "TEACHER"
    });
  });

  it("deve realizar login com sucesso e retornar token", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "prof@test.com",
        password: "senha123"
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("prof@test.com");
  });

  it("deve falhar ao tentar logar com email inexistente", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "naoexiste@teste.com",
        password: "senha123"
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Usuário não encontrado");
  });

  it("deve falhar ao tentar logar com senha errada", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "prof@test.com",
        password: "senhaErrada"
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Usuário e senha não conferem");
  });
});
