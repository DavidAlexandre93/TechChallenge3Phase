import styled from "styled-components";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useEffect, useRef } from "react";
import { useSearch } from "@/hooks/useSearch";
import { useLocation, useNavigate } from "react-router-dom";

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 600px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.08);
  padding: 10px 16px;
  gap: 10px;
  transition: all 0.2s ease-in-out;

  &:focus-within {
    box-shadow: 0px 0px 0px 3px rgba(0, 122, 255, 0.25);
  }
`;

const SearchIcon = styled(FaSearch)`
  color: #6b7280;
  font-size: 1rem;
  min-width: 16px;
  min-height: 16px;
`;

const ClearIcon = styled(FaTimes)`
  color: #9ca3af;
  font-size: 0.9rem;
  min-width: 16px;
  min-height: 16px;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    color: #4b5563;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 1rem;
  color: #111827;

  &::placeholder {
    color: #9ca3af;
  }

  
`;

export function SearchBar() {
  const { searchTerm, setSearchTerm } = useSearch();
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const handleClear = () => {
    setSearchTerm("");
  };

  useEffect(() => {
    if (location.pathname.startsWith("/post/")) {
      setSearchTerm("");
    }
  }, [location.pathname, setSearchTerm]);

  return (

    <SearchContainer>
      <SearchIcon />
      <SearchInput ref={inputRef} type="text" placeholder="Pesquisar..." id="search-bar" onChange={handleChange} value={searchTerm}/>
      {searchTerm && <ClearIcon onClick={handleClear} title="Limpar busca" />}
    </SearchContainer>
  );
}
