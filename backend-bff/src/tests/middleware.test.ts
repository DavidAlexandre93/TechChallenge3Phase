import { authenticate, authorizeRole, AuthRequest } from "../middleware/auth";
import jwt from "jsonwebtoken";
import { Response } from "express";

const SECRET = process.env.JWT_SECRET || "testsecret";

function mockResponse() {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

function mockNext() {
  return jest.fn();
}

describe("Middleware - authenticate", () => {
  it("retorna 401 se o token estiver ausente", () => {
    const req = { headers: {} } as AuthRequest;
    const res = mockResponse();
    const next = mockNext();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token ausente" });
    expect(next).not.toHaveBeenCalled();
  });

  it("retorna 401 se o token for inválido", () => {
    const req = {
      headers: {
        authorization: "Bearer token_invalido"
      }
    } as AuthRequest;

    const res = mockResponse();
    const next = mockNext();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token inválido" });
  });

  it("permite o acesso com token válido", () => {
    const token = jwt.sign(
      { id: "1", name: "Teste", role: "TEACHER" },
      SECRET
    );

    const req = {
      headers: { authorization: `Bearer ${token}` }
    } as AuthRequest;

    const res = mockResponse();
    const next = mockNext();

    authenticate(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user?.name).toBe("Teste");
  });
});

describe("Middleware - authorizeRole", () => {
  it("bloqueia usuário com papel não permitido", () => {
    const req = {
      user: { id: "1", name: "Aluno", role: "STUDENT" }
    } as AuthRequest;

    const res = mockResponse();
    const next = mockNext();

    authorizeRole("TEACHER")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Sem permissão" });
  });

  it("permite usuário com papel permitido", () => {
    const req = {
      user: { id: "1", name: "Prof", role: "TEACHER" }
    } as AuthRequest;

    const res = mockResponse();
    const next = mockNext();

    authorizeRole("TEACHER")(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
