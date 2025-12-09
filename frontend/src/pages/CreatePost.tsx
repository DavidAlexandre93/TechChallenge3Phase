import { useState } from "react";
import { createPost } from "@/api/postService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import styled from "styled-components";

const Container = styled.div`
  width: calc(100% - 40px);
  max-width: 700px;
  margin: 20px auto 40px auto;
  background: ${({ theme }) => theme.colors.card};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 20px 30px;
  /* margin-bottom: 40px; */

  @media (max-width: 375px) {
    padding: 12px 16px;
    padding-bottom: 60px;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
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
  textarea {
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
`;

const Button = styled.button<{ $variant?: "primary" | "ghost" }>`
  background: ${({ $variant, theme }) =>
    $variant === "primary" ? theme.colors.primary : "transparent"};
  color: ${({ $variant }) => ($variant === "primary" ? "white" : "#6b7280")};
  border: ${({ $variant }) =>
    $variant === "ghost" ? "1px solid #f9fafb" : "none"};
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

  @media (max-width: 400px) {
    padding: 6px;
  }
`;

export function CreatePost() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState(useAuth().user?.name || "Autor Desconhecido");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const action = (form.elements.namedItem("action") as HTMLInputElement)?.value;
    const finalStatus = action === "publicar" ? "publicado" : "rascunho";

    await createPost({
      title,
      content,
      author,
      status: finalStatus,
      publicationDate: finalStatus === "publicado" ? new Date() : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    navigate("/");
  }

  return (
    <Container>
      <HeaderRow>
        <h2>Nova Postagem</h2>
        <a onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
          Cancelar
        </a>
      </HeaderRow>

      <form onSubmit={handleSubmit}>
        <FormGroup>
          <label>Título</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Digite o título..."
          />
        </FormGroup>

        <FormGroup>
          <label>Autor</label>
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Nome do autor"
          />
        </FormGroup>

        <FormGroup>
          <label>Conteúdo Completo</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escreva o conteúdo do post..."
          />
        </FormGroup>

        <ButtonRow>
          <Button type="submit" name="action" value="rascunho" $variant="ghost">
            Salvar Rascunho
          </Button>
          <Button type="submit" name="action" value="publicar" $variant="primary">
            Publicar Post
          </Button>
        </ButtonRow>
      </form>
    </Container>
  );
}
