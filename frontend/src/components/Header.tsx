import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const HeaderContainer = styled.header`
  width: 100%;
  background: ${({ theme }) => theme.colors.card};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 10px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #2563eb;
  text-decoration: none;

  svg {
    color: #2563eb;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 14px;

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
    font-size: 0.9rem;
    padding: 6px 12px;
    border-radius: 8px;
    transition: all 0.2s ease;

    &:hover {
      background: ${({ theme }) => theme.colors.background};
    }

    &.active {
      background: ${({ theme }) => theme.colors.background};
      color: #2563eb;
      font-weight: 600;
    }
  }
`;

const Button = styled.button<{ primary?: boolean }>`
  background: ${({ primary }) => (primary ? "#2563eb" : "transparent")};
  color: ${({ primary }) => (primary ? "white" : "#6b7280")};
  font-weight: 600;
  padding: 7px 16px;
  border: ${({ primary }) => (primary ? "none" : "1px solid #e5e7eb")};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <HeaderContainer>
      <Logo to="/">
        <BookOpen size={20} />
        TechBlog
      </Logo>

      <Nav>
        <Link to="/" className="active">
          Início
        </Link>

        {!user && (
          <Button primary onClick={() => navigate("/login")}>
            Área do Professor
          </Button>
        )}

        {user && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <span style={{ color: "#6b7280", margin: "0 6px" }}>|</span>
            <span style={{ color: "#374151", fontSize: "0.9rem" }}>
              👤 Olá, {user.name?.split(" ")[0] || "Professor"}
            </span>
            <Button onClick={handleLogout}>Sair</Button>
          </>
        )}
      </Nav>
    </HeaderContainer>
  );
}
