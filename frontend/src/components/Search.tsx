import styled from "styled-components";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { useSearch } from "@/hooks/useSearch";
import { useLocation, useNavigate } from "react-router-dom";

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 25px;
  padding: 0 12px;
  gap: 8px;
  transition: all 0.2s ease;
  max-width: 200px;
  height: 32px;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
  }

  @media (max-width: 600px) {
    width: calc(100% - 120px);
    max-width: 200px;
    /* padding: 0 8px; */
  }
`;

// Link para procurar os icons: https://react-icons.github.io/react-icons/
const SearchIcon = styled(FaSearch)`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
`;

const ClearIcon = styled(FaTimes)`
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.7;
  font-size: 0.8rem;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  flex: 1;
  padding: 0;
  margin: 0;

  &::placeholder {
    color: ${({ theme }) => theme.colors.text};
    opacity: 0.7;
  }
`;

export function SearchBar() {
  const [textoSearchBar, setTextoSearchBar] = useState<string>("Pesquisar...");
  const { searchTerm, setSearchTerm } = useSearch();
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth < 350) {
        setTextoSearchBar("");
        } else {
        setTextoSearchBar("Pesquisar...");
        }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    // if (inputRef.current) inputRef.current.value = "";
  };

  useEffect(() => {
    if (location.pathname.startsWith("/post/")) {
      setSearchTerm("");
    }
  }, [location.pathname, setSearchTerm]);

  return (

    <SearchContainer>
      <SearchIcon />
      <SearchInput ref={inputRef} type="text" placeholder={textoSearchBar} id="search-bar" onChange={handleChange} value={searchTerm}/>
      {searchTerm && <ClearIcon onClick={handleClear} title="Limpar busca" />}
    </SearchContainer>
  );
}
