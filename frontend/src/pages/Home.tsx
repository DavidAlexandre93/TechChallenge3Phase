import styled from "styled-components";
import { useEffect, useState } from "react";
import { getAllPosts } from "@/api/postService";
import { Link } from "react-router-dom";
import { useSearch } from "@/hooks/useSearch";
import { useAuth } from "@/hooks/useAuth";
import type { Post } from "@/models/postModel";
import { SearchBar } from "@/components/Search";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* ✅ centraliza horizontalmente */
  justify-content: flex-start;
  width: 100%;
  max-width: 1200px; /* limite para conteúdo */
  margin: 0 auto; /* ✅ centraliza o container na viewport */
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;


const Hero = styled.section`
  background: linear-gradient(90deg, #2563eb, #1e40af);
  color: white;
  border-radius: 12px;
  padding: 50px 60px;
  width: 100%;
  max-width: 900px; /* ✅ largura máxima controlada, centraliza o bloco */
  text-align: center; /* ✅ Centraliza texto e search dentro do hero */
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  margin-top: 40px;
  margin-bottom: 60px;

  h1 {
    font-size: 2.4rem;
    font-weight: 700;
    margin-bottom: 12px;
  }

  p {
    color: #dbeafe;
    margin-bottom: 20px;
    font-size: 1.1rem;
  }

  .search-wrapper {
    background-color: white;
    border-radius: 10px;
    max-width: 400px;
    margin: 0 auto; /* ✅ Centraliza a barra de busca */
    padding: 6px 10px;
  }

  @media (max-width: 768px) {
    padding: 40px 20px;
  }
`;

const PostsSection = styled.section`
  width: 100%;
  max-width: 900px; /* ✅ Centraliza o grid igual ao hero */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  text-align: left;

  h2 {
    font-size: 1.6rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    align-self: flex-start; /* título alinhado à esquerda dentro do container central */
  }
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  width: 100%;
`;

const PostCard = styled(Link)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: 10px;
  padding: 20px;
  text-decoration: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.15s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.12);
  }

  h3 {
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.2rem;
    margin-bottom: 10px;
  }

  p {
    color: ${({ theme }) => theme.colors.secondary};
    font-size: 0.95rem;
  }
`;

export function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { searchTerm } = useSearch();
  const { user } = useAuth();

  useEffect(() => {
    getAllPosts().then(setPosts);
  }, []);

  const postsFiltrados = posts.filter((p) => {
    const termo = searchTerm.toLowerCase();
    const matches =
      p.title.toLowerCase().includes(termo) ||
      p.content.toLowerCase().includes(termo);
    if (user?.role === "TEACHER") return matches;
    return matches && p.status === "publicado";
  });

  return (
    <Container>
      <Hero>
        <h1>Bem-vindo ao TechBlog</h1>
        <p>Explore o conhecimento compartilhado pelos nossos docentes.</p>
        <div className="search-wrapper">
          <SearchBar />
        </div>
      </Hero>

      <PostsSection>
        {postsFiltrados.length === 0 ? (
          <p style={{ color: "#888", fontWeight: "500" }}>
            Nenhum post encontrado.
          </p>
        ) : (
          <PostsGrid>
            {postsFiltrados.map((p) => (
              <PostCard key={p._id} to={`/post/${p._id}`}>
                <h3>{p.title}</h3>
                <p>
                  {p.content.length > 150
                    ? p.content.slice(0, 150) + "..."
                    : p.content}
                </p>
              </PostCard>
            ))}
          </PostsGrid>
        )}
      </PostsSection>
    </Container>
  );
}
