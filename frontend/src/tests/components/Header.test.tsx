import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { lightTheme } from "@/styles/theme";

vi.mock("@/hooks/useAuth");
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("Header", () => {
  const mockUseAuth = useAuth as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("mostra 'Área do Professor' quando não há usuário", () => {
    mockUseAuth.mockReturnValue({ user: null });

    render(
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(
      screen.getByRole("button", { name: /área do professor/i })
    ).toBeInTheDocument();
  });

  it("navega para /login ao clicar em 'Área do Professor'", () => {
    const navigate = vi.fn();
    mockUseAuth.mockReturnValue({ user: null });
    (useNavigate as Mock).mockReturnValue(navigate);

    render(
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /área do professor/i }));

    expect(navigate).toHaveBeenCalledWith("/login");
  });

  it("mostra nome do usuário e botão Sair quando autenticado", () => {
    mockUseAuth.mockReturnValue({
      user: { name: "João Silva" },
      logout: vi.fn(),
    });

    render(
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByText(/olá, joão/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sair/i })).toBeInTheDocument();
  });

  it("logout chama logout() e navega para /", () => {
    const logout = vi.fn();
    const navigate = vi.fn();

    mockUseAuth.mockReturnValue({
      user: { name: "Professor" },
      logout,
    });

    (useNavigate as Mock).mockReturnValue(navigate);

    render(
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /sair/i }));

    expect(logout).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith("/");
  });
});
