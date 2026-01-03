import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { EditPost } from "@/pages/EditPost";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "@/styles/theme";
import { usePosts } from "@/hooks/usePosts";

vi.mock("@/hooks/usePosts");

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const r = await vi.importActual("react-router-dom");
    return {
        ...r,
        useNavigate: () => mockNavigate,
    };
});

describe("EditPost Page", () => {
    const mockFetchPostById = vi.fn();
    const mockUpdatePost = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        vi.spyOn(window, "confirm").mockReturnValue(true);
        vi.spyOn(window, "alert").mockImplementation(() => { });
        vi.spyOn(console, "error").mockImplementation(() => { });
        (usePosts as Mock).mockReturnValue({
            posts: [],
            loading: false,
            error: null,
            fetchPosts: vi.fn(),
            fetchPostById: mockFetchPostById,
            createPost: vi.fn(),
            updatePost: mockUpdatePost,
            deletePost: vi.fn(),
        });
    });

    const post = {
        _id: "123",
        title: "Meu Post",
        content: "Conteúdo",
        author: "Autor",
        status: "publicado",
        publicationDate: "2025-02-01",
        createdAt: new Date(),
    };

    function renderWithId(id: string) {
        return render(
            <ThemeProvider theme={lightTheme}>
                <MemoryRouter initialEntries={[`/edit/${id}`]}>
                    <Routes>
                        <Route path="/edit/:id" element={<EditPost />} />
                    </Routes>
                </MemoryRouter>
            </ThemeProvider>
        );
    }

    // ---------------------- //
    it("mostra carregando", async () => {
        mockFetchPostById.mockResolvedValue(post);

        renderWithId("123");

        expect(screen.getByText("Carregando...")).toBeInTheDocument();

        await screen.findByDisplayValue("Meu Post");
    });

    // ---------------------- //
    it("erro quando API retorna null", async () => {
        mockFetchPostById.mockResolvedValue(null);

        renderWithId("123");

        await screen.findByText("Erro");
        expect(screen.getByText("Postagem não encontrada.")).toBeInTheDocument();
    });

    // ---------------------- //
    it("preenche campos corretamente", async () => {
        mockFetchPostById.mockResolvedValue(post);

        renderWithId("123");

        expect(await screen.findByDisplayValue("Meu Post")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Autor")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Conteúdo")).toBeInTheDocument();
    });

    // ---------------------- //
    it("edita campos", async () => {
        mockFetchPostById.mockResolvedValue(post);

        renderWithId("123");

        const titleInput = await screen.findByDisplayValue("Meu Post");

        fireEvent.change(titleInput, { target: { value: "Novo Título" } });

        expect(titleInput).toHaveValue("Novo Título");
    });

    // ---------------------- //
    it("salva alterações", async () => {
        mockFetchPostById.mockResolvedValue(post);
        mockUpdatePost.mockResolvedValue({ ...post });

        renderWithId("123");

        const btn = await screen.findByText("Salvar Alterações");
        fireEvent.click(btn);

        await waitFor(() => {
            expect(mockUpdatePost).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith("/post/123");
        });
    });

    // ---------------------- //
    it("erro ao salvar", async () => {
        mockFetchPostById.mockResolvedValue(post);
        mockUpdatePost.mockRejectedValue({
            response: { data: { message: "Falha no servidor" } },
        });

        renderWithId("123");

        const btn = await screen.findByText("Salvar Alterações");

        fireEvent.click(btn);

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("Falha no servidor");
        });
    });

    // ---------------------- //
    it("não salva se título ou conteúdo vazios", async () => {
        mockFetchPostById.mockResolvedValue({ ...post, title: "" });

        renderWithId("123");

        const btn = await screen.findByText("Salvar Alterações");
        fireEvent.click(btn);

        expect(mockUpdatePost).not.toHaveBeenCalled();
        expect(window.alert).toHaveBeenCalledWith(
            "Título e conteúdo são obrigatórios."
        );
    });
});
