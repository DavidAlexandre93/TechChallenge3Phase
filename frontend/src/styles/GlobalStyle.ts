import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center; /* ✅ Centraliza horizontalmente */
    justify-content: flex-start;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: 'Segoe UI', Roboto, sans-serif;
    overflow-x: hidden;
  }

  main {
    width: 100%;
    max-width: 1200px; /* ✅ Limita a largura do conteúdo */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    margin: 0 auto; /* ✅ Centraliza o bloco principal */
    padding: 0;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
  }

  button {
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s ease;
  }

  /* Botões padrão */
  .btn-primary {
    background: ${({ theme }) => theme.colors.button.primary};
    color: #fff;
  }

  .btn-primary:hover {
    background: ${({ theme }) => theme.colors.button.primaryHover};
  }

  .post {
    background: ${({ theme }) => theme.colors.card};
    padding: 16px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    margin-bottom: 12px;
    width: 100%;
    max-width: 900px;
  }
`;
