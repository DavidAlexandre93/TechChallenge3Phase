import styled from "styled-components";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "@/components/Search";
import { useSearch } from "@/hooks/useSearch";
import { useAuth } from "@/hooks/useAuth";

const HeaderBar = styled.header`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  position: fixed;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 900px;
  border-radius: 8px;
  z-index: 1000;
  
  nav {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
  }

  @media (max-width: 980px) {
    width: calc(100% - 2rem);
    gap: 10px;
    padding: 10px;
  }
`;

const ThemeButton = styled.button`
  background: ${({ theme }) => theme.colors.button.primary};
  border: 1px solid white;
  color: ${({ theme }) => theme.colors.button.secondary};
  font-size: 0.9rem;
  padding: 6px 10px;
  border-radius: 4px;
  margin-left: 10px;

  @media (max-width: 600px) {
    display: none;
    };
`;

export function Header({
  isDarkMode,
  toggleTheme,
}: {
  isDarkMode: boolean;
  toggleTheme: () => void;
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { setSearchTerm } = useSearch();
  
  const [textoInicio, setTextoInicio] = useState<string>("Página inicial");
  const [textoThemeButtonDark, setTextoThemeButtonDark] = useState<string>("🌙 Escuro");
  const [textoThemeButtonLight, setTextoThemeButtonLight] = useState<string>("☀️ Claro");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setTextoInicio("Início");
        setTextoThemeButtonDark("🌙");
        setTextoThemeButtonLight("☀️");
      } else {
        setTextoInicio("Página inicial");
        setTextoThemeButtonDark("🌙 Escuro");
        setTextoThemeButtonLight("☀️ Claro");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleInicioClick = () => { setSearchTerm(""); };

  return (
    <HeaderBar>
      <nav>
        <Link to="/" style={{ color: "white" }} onClick={handleInicioClick}>
          {textoInicio}
        </Link>
      </nav>

      <SearchBar />

      <div>
        {user ? (
          <>
            <Link to="/" onClick={handleLogout} style={{ color: "white" }}>
              Sair
            </Link>
          </>
        ) : (
          <Link to="/login" style={{ color: "white" }}>
            Entrar
          </Link>
        )}

        <ThemeButton onClick={toggleTheme}>
          {isDarkMode ? textoThemeButtonDark : textoThemeButtonLight}
        </ThemeButton>
      </div>
    </HeaderBar >
  );
}
