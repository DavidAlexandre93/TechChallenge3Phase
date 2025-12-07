import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getPostById, updatePost } from "@/api/postService";
import type { Post } from "@/models/postModel";
import { useAuth } from "@/hooks/useAuth";
import styled from "styled-components";

const PostContainer = styled.div`
  max-width: 800px;
  margin: 40px auto;
  background: ${({ theme }) => theme.colors.card};
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  padding: 2rem 2.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const PostTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
`;

const PostContent = styled.p`
  font-size: 1.05rem;
  line-height: 1.7;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.text};
`;

const PostMeta = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const PostActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 2rem;

  button {
    padding: 10px 18px;
    border-radius: 6px;
    font-size: 0.95rem;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
  }

  .btn-primary {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
  }

  .btn-danger {
    background-color: #e74c3c;
    color: white;
  }

  .btn-primary:hover {
    opacity: 0.9;
  }

  .btn-danger:hover {
    opacity: 0.9;
  }
`;

export function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) getPostById(id).then(setPost);
  }, [id]);

  if (!post) return <p style={{ textAlign: "center", marginTop: "50px" }}>Carregando...</p>;

  async function handleDelete() {
    if (!post) return;
    if (!confirm("Tem certeza que deseja deletar este post?")) return;

    await updatePost(post._id, {
      ...post,
      status: "deletado",
      publicationDate: null,
      updatedAt: new Date()
    });

    navigate("/");
  }

  return (
    <PostContainer>
      <PostTitle>{post.title}</PostTitle>
      <PostContent>{post.content}</PostContent>

      <PostMeta>
        <span><strong>Autor:</strong> {post.author ?? "Autor Desconhecido"}</span>
        {user?.role === "TEACHER" && (
          <span>
            <strong>Status:</strong> {post.status} — Atualizado em:{" "}
            {new Date(post.updatedAt).toLocaleDateString("pt-BR")}
          </span>
        )}
      </PostMeta>

      {user?.role === "TEACHER" && (
        <PostActions>
          <Link to={`/edit/${post._id}`}>
            <button className="btn-primary">Editar</button>
          </Link>
          <button onClick={handleDelete} className="btn-danger">Excluir</button>
        </PostActions>
      )}
    </PostContainer>
  );
}
