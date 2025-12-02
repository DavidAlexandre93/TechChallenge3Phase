import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getPostById, updatePost } from "@/api/postService";
import type { Post } from "@/models/postModel";
import { useAuth } from "@/hooks/useAuth";



export function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) getPostById(id).then(setPost);
  }, [id]);

  if (!post) return <p>Carregando...</p>;

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
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <small>Autor: {post.author}</small>
      {user?.role === "TEACHER" && (
        <small>Status: <strong>{post.status}</strong>. Última atualização em: {new Date(post.updatedAt).toLocaleDateString("pt-BR")}</small>)}

      {/* 🔒 Só TEACHER pode editar/excluir */}
      {user?.role === "TEACHER" && (
        <div style={{ marginTop: "1rem", display: "flex", gap: "10px", justifyContent: "center" }}>
          <Link to={`/edit/${post._id}`}>
            <button className="btn-primary">Editar</button>
          </Link>
          <button onClick={handleDelete} className="btn-danger">Excluir</button>
        </div>
      )}

    </article>

  );
}
