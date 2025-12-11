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
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  padding-bottom: 60px;
`;

const Hero = styled.section`
  background: linear-gradient(90deg, #2563eb, #1e40af);
  color: white;
  border-radius: 12px;
  padding: 50px 60px;
  width: calc(100% - 40px);
  max-width: 1100px;
  text-align: left;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  margin-top: 40px;
  margin-bottom: 35px;

  h1 {
    font-size: 2.2rem;
    font-weight: 700;
    margin-bottom: 10px;
  }

  p {
    color: #e0e7ff;
    margin-bottom: 20px;
    font-size: 1.05rem;
  }

  .search-wrapper {
    background-color: white;
    border-radius: 12px;
    max-width: 470px;
    padding: 4px 8px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    text-align: center;
    padding: 40px 25px;

    .search-wrapper {
      margin: 0 auto;
    }
  }
`;

const PostsSection = styled.section`
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: calc(100% - 40px);

  @media (max-width: 375px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
`;


const PostCard = styled(Link)`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06); /* ⬅️ sombra mais leve */
  padding: 22px 24px;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
  }
`;


const Tag = styled.span`
  background: #e0ebff;
  color: #2563eb;
  font-weight: 600;
  font-size: 0.8rem;
  padding: 4px 10px;
  border-radius: 8px;
  align-self: flex-start;
  margin-bottom: 12px;
`;

const Title = styled.h3`
  color: #1e3a8a;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 10px;
  line-height: 1.4;
`;

const Excerpt = styled.p`
  color: #4b5563;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 15px;
`;

const Meta = styled.div`
  font-size: 0.85rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 15px;
`;

const ReadMore = styled.button`
  background: white;
  border: 1.5px solid #2563eb;
  color: #2563eb;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-start;

  &:hover {
    background: #2563eb;
    color: white;
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
      p.content.toLowerCase().includes(termo) ||
      p.author.toLowerCase().includes(termo);
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
          <p style={{ color: "#888", fontWeight: "500", textAlign: "center" }}>
            Nenhum post encontrado.
          </p>
        ) : (
          <PostsGrid>
            {postsFiltrados.map((p) => (
              <PostCard key={p._id} to={`/post/${p._id}`}>
                <Tag>ARTIGO</Tag>
                <Title>{p.title}</Title>
                <Excerpt>
                  {p.content.length > 150
                    ? p.content.slice(0, 150) + "..."
                    : p.content}
                </Excerpt>
                <Meta>
                  <span>👤 {p.author ?? "Prof. Desconhecido"}</span>•{" "}
                  <span>
                    {p.publicationDate? new Date(new Date(p.publicationDate).getTime() + new Date(p.publicationDate).getTimezoneOffset() * 60000).toLocaleDateString("pt-BR"): "—"}
                  </span>
                </Meta>
                <ReadMore>Ler Completo</ReadMore>
              </PostCard>
            ))}
          </PostsGrid>
        )}
      </PostsSection>
    </Container>
  );
}
