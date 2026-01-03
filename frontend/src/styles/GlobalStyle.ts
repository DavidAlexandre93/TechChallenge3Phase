import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    width: 100%;
    min-height: 100%;
    display: block;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: 'Segoe UI', Roboto, sans-serif;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
  }

  main {
    width: 100%;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin: 0 auto;
    padding: 24px 32px 32px;
  }

  @media (max-width: 1024px) {
    main {
      padding: 20px 24px 28px;
    }
  }

  @media (max-width: 768px) {
    main {
      padding: 16px;
      gap: 16px;
    }
  }

  @media (max-width: 480px) {
    main {
      padding: 12px;
    }
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
