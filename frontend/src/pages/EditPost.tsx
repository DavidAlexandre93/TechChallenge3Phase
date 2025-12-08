import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPostById, updatePost } from "@/api/postService";
import type { Post } from "@/models/postModel";
import type { AxiosError } from "axios";
import styled from "styled-components";

const Container = styled.div`
  width: calc(100% - 40px);
  max-width: 700px;
  margin: 60px auto;
  background: ${({ theme }) => theme.colors.card};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 40px 50px;

  @media (max-width: 500px) {
    padding: 20px 30px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;

  label {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 6px;
  }

  input,
  textarea,
  select {
    padding: 10px 14px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 8px;
    font-size: 0.95rem;
    background: #ffffff;
    color: #000000;
    resize: none;

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
      outline: none;
    }
  }

  textarea {
    min-height: 120px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;

  @media (max-width: 500px) {
    justify-content: center;
  }

  @media (max-width: 375px) {
    gap: 6px;
  }
`;

const Button = styled.button<{ variant?: "primary" | "danger" | "ghost" }>`
  background: ${({ variant, theme }) =>
    variant === "primary"
      ? theme.colors.primary
      : variant === "danger"
      ? "#ef4444"
      : "transparent"};
  color: ${({ variant }) => (variant === "ghost" ? "#6b7280" : "white")};
  border: ${({ variant }) =>
    variant === "ghost" ? "1px solid #f9fafb" : "none"};
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 375px) {
    padding: 6px;
  }
`;

export function EditPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // 🧩 Busca do post
  useEffect(() => {
    if (!id) {
      console.error("❌ Nenhum ID foi recebido na URL.");
      setError("Postagem não encontrada.");
      return;
    }

    let mounted = true;
    getPostById(id)
      .then((p) => {
        if (!mounted) return;
        if (!p) {
          console.error("❌ getPostById retornou null ou undefined.");
          setError("Postagem não encontrada.");
        } else {
          setPost(p);
        }
      })
      .catch((err) => {
        console.error("❌ Erro ao buscar post:", err);
        setError("Erro ao carregar a postagem.");
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  // 🔸 Mensagem de erro
  if (error) {
    return (
      <Container>
        <h2>Erro</h2>
        <p style={{ color: "red" }}>{error}</p>
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          Voltar ao Painel
        </Button>
      </Container>
    );
  }

  // 🔸 Carregando
  if (!post) return <p style={{ textAlign: "center" }}>Carregando...</p>;

  // 🧩 Função para salvar
  async function handleSave() {
    if (!post) return;

    if (!post.title?.trim() || !post.content?.trim()) {
      alert("Título e conteúdo são obrigatórios.");
      return;
    }

    if (!confirm("Deseja salvar as alterações?")) return;

    setIsSaving(true);
    try {
      await updatePost(post._id, {
        title: post.title ?? "",
        content: post.content ?? "",
        author: post.author ?? "Autor Desconhecido",
        status: post.status ?? "rascunho",
        publicationDate: post.publicationDate ?? new Date(),
        createdAt: post.createdAt ?? new Date(),
        updatedAt: new Date(),
      });
      navigate(`/post/${post._id}`);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      console.error("❌ Erro ao salvar post:", error);
      alert(error.response?.data?.message || "Erro ao salvar alterações.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Container>
      <h2>Editar Postagem</h2>

      <FormGroup>
        <label>Título</label>
        <input
          value={post.title ?? ""}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
        />
      </FormGroup>

      <FormGroup>
        <label>Autor</label>
        <input
          value={post.author ?? ""}
          onChange={(e) => setPost({ ...post, author: e.target.value })}
        />
      </FormGroup>

   <FormGroup>
  <label>Status</label>
  <select
    value={post.status ?? "rascunho"}
    onChange={(e) =>
      setPost({
        ...post,
        status: e.target.value as "publicado" | "rascunho" | "deletado",
      })
    }
  >
    <option value="publicado">Publicado</option>
    <option value="rascunho">Rascunho</option>
    <option value="deletado">Deletado</option>
  </select>
</FormGroup>

<FormGroup>
  <label>Data de Publicação</label>
  <input
    type="date"
    value={
      post.publicationDate
        ? new Date(post.publicationDate).toISOString().split("T")[0]
        : ""
    }
    onChange={(e) =>
      setPost({
        ...post,
        publicationDate: e.target.value
          ? new Date(e.target.value)
          : post.publicationDate ?? new Date(),
      })
    }
  />
</FormGroup>


      <FormGroup>
        <label>Conteúdo Completo</label>
        <textarea
          value={post.content ?? ""}
          onChange={(e) => setPost({ ...post, content: e.target.value })}
        />
      </FormGroup>

      <ButtonRow>
        <Button variant="ghost" onClick={() => navigate(-1)} disabled={isSaving}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </ButtonRow>
    </Container>
  );
}
