import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPostById } from "@/api/postService";
import type { Post } from "@/models/postModel";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  padding-bottom: 60px;
  min-height: 100vh;
`;

const BackLink = styled.button`
  align-self: flex-start;
  background: none;
  border: none;
  color: #1e3a8a;
  font-size: 0.95rem;
  cursor: pointer;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    text-decoration: underline;
  }
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  padding: 30px 40px;
  max-width: 750px;
  width: 100%;
  margin-bottom: 30px;

  @media (max-width: 450px) {
    padding: 20px 25px;
  }

  @media (max-width: 350px) {
    padding: 16px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 20px;

  @media (max-width: 450px) {
    gap: 4px;
    margin-bottom: 0;
  }
`;

const Tag = styled.span`
  background: #e0e7ff;
  color: #4338ca;
  font-weight: 600;
  font-size: 0.8rem;
  padding: 4px 10px;
  border-radius: 8px;
  margin-right: 6px;


  @media (max-width: 450px) {
    padding: 4px;
  }

  @media (max-width: 375px) {
    display: none;
  }
`;

const Status = styled.span`
  background: #b4221b;
  color: #ffffff;
  font-weight: 600;
  font-size: 0.8rem;
  padding: 4px 10px;
  border-radius: 8px;

  @media (max-width: 450px) {
    padding: 4px;
  }
`;

const Dot = styled.span`
  margin: 0 4px;
`;

const Title = styled.h1`
  color: #1e3a8a;
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 12px;
`;

const Content = styled.p`
  color: #374151;
  line-height: 1.6;
  font-size: 1rem;
`;

const CommentsSection = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  padding: 25px 35px 30px;
  max-width: 750px;
  width: 100%;

  @media (max-width: 450px) {
    padding: 20px 25px;
  }

  @media (max-width: 350px) {
    padding: 16px;
  }
`;

const CommentTitle = styled.h2`
  color: #111827;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 15px;
`;

const CommentBox = styled.textarea`
  width: 100%;
  height: 90px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  padding: 12px 14px;
  resize: none;
  margin-bottom: 15px;
  font-size: 0.95rem;
  background-color: #fff;
  color: #111827;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SendButton = styled.button`
  background: #2563eb;
  color: #fff;
  font-weight: 600;
  padding: 10px 22px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s ease;
  display: block;
  margin: 0 auto;

  &:hover {
    background: #1e40af;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #93c5fd;
    cursor: not-allowed;
    transform: none;
    opacity: 0.8;
  }
`;

const NoComments = styled.p`
  color: #6b7280;
  font-size: 0.9rem;
  font-style: italic;
  margin-top: 10px;
  text-align: center;
`;

const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`;

const CommentList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const CommentItem = styled.li`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
`;

const CommentMeta = styled.span`
  display: block;
  color: #6b7280;
  font-size: 0.85rem;
  margin-bottom: 6px;
`;

const CommentText = styled.p`
  color: #111827;
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.5;
`;

type Comment = {
  id: string;
  text: string;
  createdAt: string;
};

export function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (id) {
      getPostById(id)
        .then((res) => setPost(res))
        .catch((err) => console.error("Erro ao carregar post:", err));
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;

    try {
      const saved = localStorage.getItem(`comments-${id}`);
      setComments(saved ? JSON.parse(saved) : []);
      setComment("");
    } catch (error) {
      console.error("Erro ao carregar comentários:", error);
      setComments([]);
    }
  }, [id]);

  const handleSubmitComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;

    const trimmed = comment.trim();
    if (!trimmed) return;

    const newComment: Comment = {
      id: crypto.randomUUID ? crypto.randomUUID() : `c-${Date.now()}`,
      text: trimmed,
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => {
      const updated = [newComment, ...prev];
      localStorage.setItem(`comments-${id}`, JSON.stringify(updated));
      return updated;
    });
    setComment("");
  };

  if (!post) {
    return (
      <Container>
        <p>Carregando postagem...</p>
      </Container>
    );
  }

  return (
    <Container>
      <BackLink onClick={() => navigate("/")}>← Voltar para lista</BackLink>

      <Card>
        <Header>
          <Tag>Tech</Tag>
          <span>
            {post.publicationDate
              ? new Date(post.publicationDate).toLocaleDateString("pt-BR")
              : "—"}
          </span>
          <Dot>•</Dot>
          <Status>{post.status}</Status>
          <Dot>•</Dot>
          <span>{post.author ?? "Prof. Desconhecido"}</span>
        </Header>

        <Title>{post.title}</Title>
        <Content>{post.content}</Content>
      </Card>

      <CommentsSection>
        <CommentTitle>Comentários</CommentTitle>
        <CommentForm onSubmit={handleSubmitComment}>
          <CommentBox
            aria-label="Campo para comentar"
            placeholder="Deixe seu comentário..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <SendButton type="submit" disabled={!comment.trim()}>
            Enviar Comentário
          </SendButton>
        </CommentForm>

        {comments.length === 0 ? (
          <NoComments>Seja o primeiro a comentar.</NoComments>
        ) : (
          <CommentList>
            {comments.map((entry) => (
              <CommentItem key={entry.id}>
                <CommentMeta>
                  {new Date(entry.createdAt).toLocaleString("pt-BR")}
                </CommentMeta>
                <CommentText>{entry.text}</CommentText>
              </CommentItem>
            ))}
          </CommentList>
        )}
      </CommentsSection>
    </Container>
  );
}
