import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { Dashboard } from "@/pages/Dashboard";
import { MemoryRouter } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getAllPosts, deletePost } from "@/api/postService";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "@/styles/theme";

// Mocks
vi.mock("@/hooks/useAuth");
vi.mock("@/api/postService");

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const r = await vi.importActual("react-router-dom");
    return {
        ...r,
        useNavigate: () => mockNavigate,
    };
});

describe("Dashboard Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // avoid errors from confirm/alert
        vi.spyOn(window, "confirm").mockReturnValue(true);
        vi.spyOn(window, "alert").mockImplementation(() => { });
    });

    const mockPosts = [
        {
            _id: "1",
            title: "Post Público",
            author: "João",
            status: "publicado",
            publicationDate: "2025-10-10T12:00:00Z",
            createdAt: "2025-10-10T12:00:00Z",
            updatedAt: "2025-10-10T12:00:00Z",
        },
        {
            _id: "2",
            title: "Rascunho",
            author: "Ana",
            status: "rascunho",
            publicationDate: null,
            createdAt: "2025-10-10T12:00:00Z",
            updatedAt: "2025-10-10T12:00:00Z",
        },
    ];

    function renderDash() {
        return render(
            <ThemeProvider theme={lightTheme}>
                <MemoryRouter>
                    <Dashboard />
                </MemoryRouter>
            </ThemeProvider>
        );
    }

    // ---------------------- //
    it("carrega posts para TEACHER", async () => {
        (useAuth as Mock).mockReturnValue({ user: { role: "TEACHER" } });
        (getAllPosts as Mock).mockResolvedValue(mockPosts);

        renderDash();

        expect(getAllPosts).toHaveBeenCalled();

        await waitFor(() => {
            expect(screen.getByText("Post Público")).toBeInTheDocument();
            expect(screen.getByText("Rascunho")).toBeInTheDocument();
        });
    });

    // ---------------------- //
    it("mostra apenas posts publicados para ALUNO", async () => {
        (useAuth as Mock).mockReturnValue({ user: { role: "ALUNO" } });
        (getAllPosts as Mock).mockResolvedValue(mockPosts);

        renderDash();

        await waitFor(() => {
            expect(screen.getByText("Post Público")).toBeInTheDocument();
            expect(screen.queryByText("Rascunho")).not.toBeInTheDocument();
        });
    });

    // ---------------------- //
    it("navega para /edit/:id ao clicar no editar", async () => {
        (useAuth as Mock).mockReturnValue({ user: { role: "TEACHER" } });
        (getAllPosts as Mock).mockResolvedValue(mockPosts);

        render(
            <ThemeProvider theme={lightTheme}>
                <MemoryRouter>
                    <Dashboard />
                </MemoryRouter>
            </ThemeProvider>
        );

        const editIcons = await screen.findAllByTestId("edit-icon");
        const firstEditIcon = editIcons[0];
        expect(firstEditIcon).toBeInTheDocument();

        fireEvent.click(firstEditIcon);

        expect(mockNavigate).toHaveBeenCalledWith("/edit/1");
    });

    // ---------------------- //
    it("chama deletePost e recarrega lista", async () => {
        (useAuth as Mock).mockReturnValue({ user: { role: "TEACHER" } });
        (getAllPosts as Mock).mockResolvedValue(mockPosts);
        (deletePost as Mock).mockResolvedValue({});

        render(
            <ThemeProvider theme={lightTheme}>
                <MemoryRouter>
                    <Dashboard />
                </MemoryRouter>
            </ThemeProvider>
        );

        const deleteIcons = await screen.findAllByTestId("delete-icon");
        const secondDeleteIcon = deleteIcons[1];
        expect(secondDeleteIcon).toBeInTheDocument();

        fireEvent.click(secondDeleteIcon);

        await waitFor(() => {
            expect(deletePost).toHaveBeenCalledWith("2");
            expect(getAllPosts).toHaveBeenCalledTimes(2); // inicial + reload
        });
    });

    // ---------------------- //
    it("formata data corretamente", async () => {
        (useAuth as Mock).mockReturnValue({ user: { role: "TEACHER" } });
        (getAllPosts as Mock).mockResolvedValue(mockPosts);

        renderDash();

        await screen.findByText("Post Público");

        const dateCell = screen.getByText("10/10/2025");
        expect(dateCell).toBeInTheDocument();
    });

    // ---------------------- //
    it("formata data curtinha em mobile", async () => {
        vi.spyOn(window, "innerWidth", "get").mockReturnValue(400);
        window.dispatchEvent(new Event("resize"));

        (useAuth as Mock).mockReturnValue({ user: { role: "TEACHER" } });
        (getAllPosts as Mock).mockResolvedValue(mockPosts);

        renderDash();

        await screen.findByText("Post Público");

        const dateSmall = screen.getByText("10/10/25");
        expect(dateSmall).toBeInTheDocument();
    });
});
