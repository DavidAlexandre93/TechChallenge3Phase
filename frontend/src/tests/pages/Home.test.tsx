import { describe, it, expect, vi, type Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Home } from "@/pages/Home";

import { getAllPosts } from "@/api/postService";
import { useSearch } from "@/hooks/useSearch";
import { useAuth } from "@/hooks/useAuth";

vi.mock("@/api/postService");
vi.mock("@/hooks/useSearch");
vi.mock("@/hooks/useAuth");

describe("Home Page", () => {
  const mockPosts = [
    {
      _id: "1",
      title: "Post Público",
      content: "Conteúdo de teste",
      author: "João",
      status: "publicado",
      publicationDate: "2025-01-01",
    },
    {
      _id: "2",
      title: "Post Privado",
      content: "Conteúdo secreto",
      author: "Maria",
      status: "rascunho",
      publicationDate: "2025-01-02",
    },
  ];

  beforeEach(() => {
    (getAllPosts as Mock).mockResolvedValue(mockPosts);
    (useSearch as Mock).mockReturnValue({ searchTerm: "" });
  });

  it("carrega e exibe somente posts publicados para visitante", async () => {
    (useAuth as Mock).mockReturnValue({ user: null });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Post Público")).toBeInTheDocument();
    });

    expect(screen.queryByText("Post Privado")).not.toBeInTheDocument();
  });

  it("exibe todos os posts quando usuário é professor", async () => {
    (useAuth as Mock).mockReturnValue({
      user: { role: "TEACHER" },
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Post Público")).toBeInTheDocument();
      expect(screen.getByText("Post Privado")).toBeInTheDocument();
    });
  });

  it("filtra posts pelo searchTerm", async () => {
    (useAuth as Mock).mockReturnValue({ user: null });
    (useSearch as Mock).mockReturnValue({ searchTerm: "público" });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Post Público")).toBeInTheDocument();
    });

    expect(screen.queryByText("Post Privado")).not.toBeInTheDocument();
  });

  it("exibe mensagem quando não há posts encontrados", async () => {
    (useAuth as Mock).mockReturnValue({ user: null });
    (useSearch as Mock).mockReturnValue({ searchTerm: "nada" });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Nenhum post encontrado.")).toBeInTheDocument();
    });
  });
});
