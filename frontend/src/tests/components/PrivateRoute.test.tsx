import { describe, it, expect, vi, type Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { PrivateRoute } from "@/components/PrivateRoute";
import { useAuth } from "@/hooks/useAuth";

vi.mock("@/hooks/useAuth");

describe("PrivateRoute", () => {
  it("redireciona para /login quando não há usuário", () => {
    (useAuth as Mock).mockReturnValue({ user: null });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <div>Conteúdo Protegido</div>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<div>Página de Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText("Conteúdo Protegido")).not.toBeInTheDocument();
  });

  it("renderiza children quando usuário está autenticado", () => {
    (useAuth as Mock).mockReturnValue({
      user: { name: "João", role: "TEACHER" },
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={["TEACHER"]}>
                <div>Conteúdo Protegido</div>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<div>Página de Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Conteúdo Protegido")).toBeInTheDocument();
  });

  it("bloqueia acesso quando usuário não tem papel permitido", () => {
    (useAuth as Mock).mockReturnValue({
      user: { name: "Aluno", role: "STUDENT" },
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/" element={<div>Home Pública</div>} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={["TEACHER"]}>
                <div>Conteúdo Protegido</div>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<div>Página de Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText("Conteúdo Protegido")).not.toBeInTheDocument();
    expect(screen.getByText("Home Pública")).toBeInTheDocument();
  });
});
