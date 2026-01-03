import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PostPage } from "@/pages/PostPage";
import { usePosts } from "@/hooks/usePosts";

// mocks
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<
    typeof import("react-router-dom")
  >();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "123" }),
  };
});

vi.mock("@/hooks/usePosts");

const mockPost = {
  _id: "123",
  title: "Post de Teste",
  content: "Conteúdo do post",
  author: "Autor X",
  status: "publicado",
  publicationDate: "2025-10-10T12:00:00Z",
  createdAt: "2025-10-10T12:00:00Z",
  updatedAt: "2025-10-10T12:00:00Z",
};

describe("PostPage", () => {
  const mockFetchPostById = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (usePosts as unknown as () => unknown).mockReturnValue({
      posts: [],
      loading: false,
      error: null,
      fetchPosts: vi.fn(),
      fetchPostById: mockFetchPostById,
      createPost: vi.fn(),
      updatePost: vi.fn(),
      deletePost: vi.fn(),
    });
  });

  function setup() {
    return render(
      <MemoryRouter>
        <PostPage />
      </MemoryRouter>
    );
  }

  it("exibe 'Carregando postagem...' inicialmente", async () => {
    mockFetchPostById.mockResolvedValue(mockPost);
    setup();

    expect(screen.getByText("Carregando postagem...")).toBeInTheDocument();

    // Aguarda a atualização de estado ser concluída para evitar o aviso "act"
    await screen.findByText("Post de Teste");
  });

  it("carrega e exibe o post", async () => {
    mockFetchPostById.mockResolvedValue(mockPost);

    setup();

    expect(mockFetchPostById).toHaveBeenCalledWith("123");

    await waitFor(() => {
      expect(screen.getByText("Post de Teste")).toBeInTheDocument();
    });

    expect(screen.getByText("Conteúdo do post")).toBeInTheDocument();
    expect(screen.getByText("Autor X")).toBeInTheDocument();
  });

  it("volta ao clicar no botão", async () => {
    mockFetchPostById.mockResolvedValue(mockPost);

    setup();

    await waitFor(() => {
      expect(screen.getByText("Post de Teste")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("← Voltar para lista"));

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("renderiza status e data corretamente", async () => {
    mockFetchPostById.mockResolvedValue(mockPost);

    setup();

    await waitFor(() => {
      expect(screen.getByText("publicado")).toBeInTheDocument();
    });

    expect(screen.getByText("10/10/2025")).toBeInTheDocument();
  });
});
