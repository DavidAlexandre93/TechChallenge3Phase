import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Segoe UI', Roboto, sans-serif;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    transition: all 0.3s ease;
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

  /* Botão Principal */
  .btn-primary {
    background: ${({ theme }) => theme.colors.button.primary};
    color: #fff;
  }
  .btn-primary:hover {
    background: ${({ theme }) => theme.colors.button.primaryHover};
  }

  /* Secundário / neutro */
  .btn-secondary {
    background: ${({ theme }) => theme.colors.button.secondary};
    color: #fff;
  }
  .btn-secondary:hover {
    background: ${({ theme }) => theme.colors.button.secondaryHover};
  }

  /* Botão fantasma (VOLTA) */
  .btn-ghost {
    background: ${({ theme }) => theme.colors.button.ghost};
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.border};
  }
  .btn-ghost:hover {
    background: ${({ theme }) => theme.colors.button.ghostHover};
  }

  /* Botão de exclusão */
  .btn-danger {
    background: ${({ theme }) => theme.colors.button.danger};
    color: #fff;
  }
  .btn-danger:hover {
    background: ${({ theme }) => theme.colors.button.dangerHover};
  }

  input, textarea {
    width: 100%;
    padding: 8px;
    margin-bottom: 12px;
    border-radius: 6px;
    background: ${({ theme }) => theme.colors.card};
    border: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
  }

  .post {
    background: ${({ theme }) => theme.colors.card};
    padding: 16px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    margin-bottom: 12px;
    width: calc(100vw - 2rem);
    max-width: 900px;
  }

  .home-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 900px;
    /* margin: 0 auto; */
    padding-top: 50px;
    min-height: calc(100vh - 20px);
  }

  .home-cabecalho {
    background-color: ${({ theme }) => theme.colors.background};
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    position: fixed;
    top: 0px;
    padding: 64px 0 4px 0;
    width: 95%;
    width: calc(100% - 2rem);
    max-width: 900px;
    z-index: 500;

    @media (max-width: 600px) {
    font-size: 0.9rem;
    padding: 64px 0 4px 0;
    };

    @media (max-width: 350px) {
    font-size: 0.8rem;
    padding: 62px 0 4px 0;
    }
  }
  .home-cabecalho-button {
    justify-content: right;
    position: absolute;
    right: 0px;
    margin-top: 6px;
  }

  .posts-container {
    position: relative;
    margin-top: 60px;
    margin-bottom: 20px;
    max-width: 900px;
    width: 100%;
    display: block;

    min-height: calc(100vh - 200px);
    box-sizing: border-box;

    @media (max-width: 600px) {
    margin-top: 53px;
    };

    @media (max-width: 350px) {
    margin-top: 45px;
    }
  }

  .post-view {
    background: ${({ theme }) => theme.colors.card};
    padding: 16px;
    border-radius: 8px solid ${({ theme }) => theme.colors.border};
    margin-bottom: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    row-gap: 12px;
    justify-content: center;
    align-content: center;
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 2rem);
    max-width: 900px;
  }

  .form-login,
  .form-create-post {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: fixed;
    top: 72px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 2rem);
    max-width: 400px;
  }

  .form-create-post-content {
    height: 200px;

    @media (max-width: 350px) {
    font-size: 0.9rem;
    }
  }

`;
