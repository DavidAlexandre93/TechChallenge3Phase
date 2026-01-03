import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CreatePost } from "@/pages/CreatePost";
import { MemoryRouter } from "react-router-dom";
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";

vi.mock("@/hooks/usePosts");
vi.mock("@/hooks/useAuth");

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
    const actual = await importOriginal<
        typeof import("react-router-dom")
    >();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

import { ThemeProvider } from "styled-components";
import { lightTheme } from "@/styles/theme";

describe("CreatePost", () => {
    const mockCreatePost = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (usePosts as unknown as () => unknown).mockReturnValue({
            posts: [],
            loading: false,
            error: null,
            fetchPosts: vi.fn(),
            fetchPostById: vi.fn(),
            createPost: mockCreatePost,
            updatePost: vi.fn(),
            deletePost: vi.fn(),
        });
        (useAuth as unknown as () => unknown).mockReturnValue({ user: { name: "Usuário Teste" } });
    });

    function setup() {
        return render(
            <ThemeProvider theme={lightTheme}>
                <MemoryRouter>
                    <CreatePost />
                </MemoryRouter>
            </ThemeProvider>
        );
    }

    it("renderiza o formulário corretamente", () => {
        setup();

        expect(screen.getByText("Nova Postagem")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Digite o título...")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Nome do autor")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Escreva o conteúdo do post...")).toBeInTheDocument();
    });

    it("permite digitar nos campos", () => {
        setup();

        fireEvent.change(screen.getByPlaceholderText("Digite o título..."), {
            target: { value: "Meu Post" },
        });

        fireEvent.change(screen.getByPlaceholderText("Nome do autor"), {
            target: { value: "Autor Teste" },
        });

        fireEvent.change(screen.getByPlaceholderText("Escreva o conteúdo do post..."), {
            target: { value: "Conteúdo do post" },
        });

        expect(screen.getByDisplayValue("Meu Post")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Autor Teste")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Conteúdo do post")).toBeInTheDocument();
    });

    it("salva como rascunho e navega para /", async () => {
        setup();

        fireEvent.change(screen.getByPlaceholderText("Digite o título..."), {
            target: { value: "Rascunho" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Salvar Rascunho" }));

        await waitFor(() => {
            expect(mockCreatePost).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: "Rascunho",
                    status: "rascunho",
                })
            );
        });

        expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("publica o post e navega para /", async () => {
        setup();

        fireEvent.change(screen.getByPlaceholderText("Digite o título..."), {
            target: { value: "Publicação" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Publicar Post" }));

        await waitFor(() => {
            expect(mockCreatePost).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: "Publicação",
                    content: "",
                    author: "Usuário Teste",
                    status: "publicado",
                    publicationDate: expect.any(Date),
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                })
            );
        });

        expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("volta ao clicar em cancelar", () => {
        setup();

        fireEvent.click(screen.getByText("Cancelar"));

        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
});
