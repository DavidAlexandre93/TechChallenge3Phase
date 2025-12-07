import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPostById } from "@/api/postService";
import { useAuth } from "@/hooks/useAuth";
import type { Post } from "@/models/postModel";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 40px 20px;
  min-height: 80vh;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 30px 40px;
  max-width: 700px;
  width: 100%;
`;

const Title = styled.h1`
  color: #1e3a8a;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 12px;
`;

const Content = styled.p`
  color: #374151;
  line-height: 1.6;
  font-size: 1.05rem;
  margin-bottom: 20px;
`;

const Meta = styled.div`
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 20px;
`;

export function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getPostById(id)
        .then((res) => {
          if (!res) {
            console.error("⚠️ Nenhum post encontrado!");
          }
          setPost(res);
        })
        .catch((err) => {
          console.error("🚨 Erro ao buscar post:", err);
        });
    } else {
      console.error("❌ ID não encontrado na URL!");
    }
  }, [id]);

  if (!post) {
    return (
      <Container>
        <p>Carregando postagem...</p>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <Title>{post.title}</Title>
        <Content>{post.content}</Content>

        <Meta>
          <strong>Autor:</strong> {post.author ?? "Desconhecido"} <br />
          <strong>Status:</strong> {post.status} <br />
          <strong>Publicado em:</strong>{" "}
          {post.publicationDate
            ? new Date(post.publicationDate).toLocaleDateString("pt-BR")
            : "—"}
        </Meta>

        {/* Exibe os botões APENAS para professores logados */}
        
      </Card>
    </Container>
  );
}
