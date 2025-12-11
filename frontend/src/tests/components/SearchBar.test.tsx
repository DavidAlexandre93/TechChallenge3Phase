import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SearchBar } from "@/components/Search";

const mockSetSearchTerm = vi.fn();

vi.mock("@/hooks/useSearch", () => ({
  useSearch: () => ({
    searchTerm: mockSearchTerm,
    setSearchTerm: mockSetSearchTerm,
  }),
}));

let mockSearchTerm = "";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("SearchBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchTerm = "";
  });

  it("renderiza corretamente", () => {
    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/pesquisar/i)).toBeInTheDocument();
  });

  it("atualiza searchTerm ao digitar", () => {
    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/pesquisar/i), {
      target: { value: "React" },
    });

    expect(mockSetSearchTerm).toHaveBeenCalledWith("React");
  });

  it("se não estiver na home, navega para / quando digitar", () => {
    render(
      <MemoryRouter initialEntries={["/alguma-rota"]}>
        <SearchBar />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/pesquisar/i), {
      target: { value: "abc" },
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("mostra ícone de limpar e limpa o texto ao clicar", () => {
    mockSearchTerm = "texto";

    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>
    );

    const clearBtn = screen.getByTitle(/limpar busca/i);
    fireEvent.click(clearBtn);

    expect(mockSetSearchTerm).toHaveBeenCalledWith("");
  });

  it("limpa a busca ao entrar em /post/:id", () => {
    mockSearchTerm = "teste";

    render(
      <MemoryRouter initialEntries={["/post/123"]}>
        <SearchBar />
      </MemoryRouter>
    );

    expect(mockSetSearchTerm).toHaveBeenCalledWith("");
  });
});
