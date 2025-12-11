import { describe, it, expect, vi, type Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Login } from "@/pages/Login";

import { loginUser } from "@/api/authService";
import { useAuth } from "@/hooks/useAuth";

vi.mock("@/api/authService");
vi.mock("@/hooks/useAuth");
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<
    typeof import("react-router-dom")
  >();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe("Login Page", () => {
  //   const mockNavigate = vi.fn();
  const mockLogin = vi.fn();

  (useAuth as Mock).mockReturnValue({ login: mockLogin });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza inputs e botão", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText("professor@fiap.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Senha")).toBeInTheDocument();
    expect(screen.getByText("Entrar no Sistema")).toBeInTheDocument();
  });

  it("preenche email e senha", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const email = screen.getByPlaceholderText("professor@fiap.com");
    const senha = screen.getByPlaceholderText("Senha");

    fireEvent.change(email, { target: { value: "teste@teste.com" } });
    fireEvent.change(senha, { target: { value: "123" } });

    expect(email).toHaveValue("teste@teste.com");
    expect(senha).toHaveValue("123");
  });

  it("faz login com sucesso", async () => {
    (loginUser as Mock).mockResolvedValue({
      user: {
        id: "10",
        name: "Professor",
        email: "teste@teste.com",
        role: "TEACHER",
      },
      token: "abc123",
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("professor@fiap.com"), {
      target: { value: "teste@teste.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Senha"), {
      target: { value: "123" },
    });

    fireEvent.click(screen.getByText("Entrar no Sistema"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });
  });

  it("mostra alerta ao falhar login", async () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => { });
    (loginUser as Mock).mockRejectedValue(new Error("invalid"));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Entrar no Sistema"));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Credenciais inválidas");
    });
  });
});
