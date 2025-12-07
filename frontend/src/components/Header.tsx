import styled from "styled-components";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSearch } from "@/hooks/useSearch";

const HeaderContainer = styled.header`
  width: 100%;
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const NavButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;

  a {
    font-size: 0.9rem;
    text-decoration: none;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.card};
    padding: 0.4rem 0.9rem;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    transition: all 0.25s ease;

    &:hover {
      background: ${({ theme }) => theme.colors.primary};
      color: white;
    }
  }
`;

/* 🔵 Botão azul fixo (independente do tema) */
const ProfessorButton = styled(Link)`
  background: linear-gradient(135deg, #2563eb, #1d4ed8) !important;
  color: #ffffff !important;
  font-weight: 600;
  text-decoration: none;
  border: none !important;
  border-radius: 10px;
  padding: 0.5rem 1.2rem;
  font-size: 0.95rem;
  letter-spacing: 0.3px;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
  transition: all 0.25s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;

  &:hover {
    background: linear-gradient(135deg, #1e40af, #1d4ed8) !important;
    box-shadow: 0 4px 10px rgba(37, 99, 235, 0.45);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export function Header() {
  const { user, logout } = useAuth();
  const { setSearchTerm } = useSearch();

  const handleLogout = () => logout();
  const handleInicioClick = () => setSearchTerm("");

  return (
    <HeaderContainer>
      {/* --- LOGO --- */}
      <Logo>
        <span role="img" aria-label="book">📘</span>
        TechBlog
      </Logo>

      {/* --- NAVIGATION BUTTONS --- */}
      <NavButtons>
        <Link to="/" onClick={handleInicioClick}>
          Início
        </Link>

        {/* 🔵 Exibe botão azul */}
        {!user ? (
          <ProfessorButton to="/login">Área do Professor</ProfessorButton>
        ) : user.role === "TEACHER" ? (
          <ProfessorButton to="/create">Área do Professor</ProfessorButton>
        ) : (
          <Link to="/" onClick={handleLogout}>
            Sair
          </Link>
        )}
      </NavButtons>
    </HeaderContainer>
  );
}
