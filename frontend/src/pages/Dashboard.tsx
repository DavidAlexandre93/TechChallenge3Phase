import styled from "styled-components";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllPosts, deletePost } from "@/api/postService";
import { useAuth } from "@/hooks/useAuth";
import type { Post } from "@/models/postModel";
import { Edit2, Trash2, PlusCircle } from "lucide-react";

const Container = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 20px auto 40px auto;
  padding: 0 20px;
  min-height: 80vh;
  padding-bottom: 20px;

  @media (max-width: 425px) {
    padding: 0 10px;
    padding-bottom: 10px;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;

  h1 {
    font-size: 1.6rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
  }

  p {
    color: ${({ theme }) => theme.colors.secondary};
    font-size: 0.95rem;
    margin-top: 2px;
  }

  @media (max-width: 425px) {
    h1 {
      font-size: 1.5rem;
    }

    p {
      font-size: 0.85rem;
    }
  }
`;

const NewPostButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  font-weight: 600;
  border-radius: 10px;
  padding: 8px;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.25s ease;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);

  svg {
    flex-shrink: 0;
  }

  &:hover {
    background: linear-gradient(135deg, #1e40af, #1d4ed8);
    box-shadow: 0 4px 10px rgba(37, 99, 235, 0.45);
    transform: translateY(-2px);
  }

  @media (max-width: 425px) {
    font-size: 0.85rem;
    padding: 6px;
  }
`;

const Table = styled.table`
  width: 100%;
  background: ${({ theme }) => theme.colors.card};
  border-collapse: collapse;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
`;

const Th = styled.th`
  text-align: left;
  padding: 14px 18px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.secondary};
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  text-transform: uppercase;
  letter-spacing: 0.03rem;

  @media (max-width: 700px) {
    font-size: 0.8rem;
    padding: 10px;
  }

  @media (max-width: 500px) {
    font-size: 0.7rem;
    padding: 4px;
  }
`;

const Td = styled.td`
  padding: 14px 18px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text};
  vertical-align: middle;

  &:first-child {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: 700px) {
    font-size: 0.8rem;
    padding: 10px;
  }

  @media (max-width: 500px) {
    font-size: 0.7rem;
    padding: 4px;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;

  svg {
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  svg:hover {
    transform: scale(1.1)
  }

  .edit {
    color: #2563eb;
  }

  .edit:hover {
    color: #1d4ed8;
    transform: scale(1.1);
  }

  .delete {
    color: #ef4444;
  }

  .delete:hover {
    color: #dc2626;
    transform: scale(1.1);
  }

  @media (max-width: 700px) {
    gap: 10px;
  }

  @media (max-width: 375px) {
      flex-direction: column;
      gap: 6px;
    }
`;


export function Dashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAllPosts().then((res) => {
      if (!res || res.length === 0) return;

      // Professores veem todos os posts
      if (user?.role === "TEACHER") {
        setPosts(res);
      } else {
        setPosts(res.filter((p) => p.status === "publicado"));
      }
    });
  }, [user]);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth <= 425);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este post?")) return;
    await deletePost(id);
    const updatedPosts = await getAllPosts();
    setPosts(updatedPosts);
  }

  function handleEdit(id?: string) {
    if (!id) {
      alert("ID inválido para edição.");
      return;
    }
    navigate(`/edit/${id}`);
  }

  function formatDate(dateString: Date | string): string {
    const full = new Date(dateString).toLocaleDateString("pt-BR");

    if (!isMobile) return full;

    // "04/10/2025" → "04/10/25"
    return full.replace(/(\d{4})$/, (yy) => yy.slice(-2));
  }

  return (
    <Container>
      <HeaderSection>
        <div>
          <h1>Painel Administrativo</h1>
          <p>Gerencie as postagens do blog.</p>
        </div>
        <NewPostButton to="/create">
          <PlusCircle size={18} /> Novo Post
        </NewPostButton>
      </HeaderSection>

      <Table>
        <thead>
          <tr>
            <Th>Título</Th>
            <Th>Autor</Th>
            <Th>Data</Th>
            <Th>Status</Th>
            <Th>Ações</Th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post._id}>
              <Td>{post.title}</Td>
              <Td>{post.author}</Td>
              <Td>
                {post.publicationDate
                  ? formatDate(post.publicationDate)
                  : "—"}
              </Td>
              <Td>{post.status ?? "—"}</Td>
              <Td>
                <Actions>
                  <Edit2
                    size={18}
                    className="edit"
                    data-testid="edit-icon"
                    onClick={() => handleEdit(post._id)}
                  />
                  <Trash2
                    size={18}
                    className="delete"
                    data-testid="delete-icon"
                    onClick={() => handleDelete(post._id!)}
                  />
                </Actions>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
