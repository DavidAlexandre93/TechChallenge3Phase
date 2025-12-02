import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getPostById, updatePost } from "@/api/postService";
import type { Post } from "@/models/postModel";
import type { AxiosError } from "axios";

export function EditPost() {
    const { id } = useParams();
    const [post, setPost] = useState<Post | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        //     if (id) getPostById(id).then(setPost);
        // }, [id]);
        if (!id) return;
        let mounted = true;

        getPostById(id)
            .then((p) => {
                if (mounted) setPost(p);
            })
            .catch((err) => {
                console.error("Erro ao buscar post:", err);
                alert("Erro ao carregar o post.");
            });

        return () => {
            mounted = false;
        };
    }, [id]);

    if (!post) return <p>Carregando...</p>;

    async function handleEdit() {
        if (!post) return;

        if (!post.title?.trim() || !post.content?.trim()) {
            alert("Título e conteúdo são obrigatórios.");
            return;
        };

        if (!confirm("Tem certeza que deseja editar este post?")) return;

        setIsSaving(true);
        try {
            await updatePost(post._id, {
                title: post.title,
                content: post.content,
                author: post.author ?? "Autor Desconhecido",
                status: post.status ?? "rascunho",
                publicationDate: post.publicationDate ?? null,
                createdAt: post.createdAt ?? new Date(),
                updatedAt: new Date()
            }
            );
            navigate("/post/" + post._id);
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
            console.error("Erro ao atualizar post:", err);

            // Axios costuma expor response.status
            const status = error?.response?.status;
            if (status === 401) {
                alert("Sessão expirada ou não autorizado. Faça login novamente.");
                navigate("/login");
                return;
            }

            // mensagem genérica
            const message = error?.response?.data?.message || error?.message || "Erro ao salvar post.";
            alert(message);
        } finally {
            setIsSaving(false);
        }

        // if (post !== null) {
        //     if (!post.title || !post.content) {
        //         alert("Título e conteúdo são obrigatórios.");
        //         return;
        //     }

        //     if (confirm("Tem certeza que deseja editar este post?")) {
        //         await updatePost(post._id, { title: post.title, content: post.content });
        //         navigate("/post/" + post._id);
        //     }
        // }
    };

    async function handleDelete() {
        if (!post) return;

        if (!confirm("Tem certeza que deseja deletar este post?")) {
            return;
        } else {
            await updatePost(post._id, {
                title: post.title,
                content: post.content,
                author: post.author ?? "Autor Desconhecido",
                status: "deletado",
                publicationDate: null,
                createdAt: post.createdAt ?? new Date(),
                updatedAt: new Date()
            }
            );
            navigate("/");
        }
    }


    return (
        <article className="post-view">
            <h2>
                <input
                    type="text"
                    value={post.title ?? ""}
                    onChange={(e) => setPost({ ...post, title: e.target.value })}
                    placeholder="Título"
                />
            </h2>
            <p>
                <textarea
                    value={post.content ?? ""}
                    onChange={(e) => setPost({ ...post, content: e.target.value })}
                    placeholder="Conteúdo"
                    rows={8}
                />
            </p>
            <small>Autor: {post.author ?? "Desconhecido"}</small>

            <div style={{ marginTop: "1rem", display: "flex", gap: "10px", justifyContent: "center" }}>
                <Link to={`/post/${id}`} >
                    <button className="btn-ghost" disabled={isSaving}>Voltar</button>
                </Link>
                <button onClick={handleEdit} className="btn-primary" disabled={isSaving}>
                    {isSaving ? "Salvando..." : "Salvar"}
                </button>
                <button onClick={handleDelete} className="btn-danger" disabled={isSaving}>Excluir</button>
            </div>
        </article>

    );
}
