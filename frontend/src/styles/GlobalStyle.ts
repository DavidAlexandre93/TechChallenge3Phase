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
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    border: none;
    padding: 8px 14px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    transition: background 0.2s;
  }

  button:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }

  input, textarea {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 6px;
    background: ${({ theme }) => theme.colors.card};
    color: ${({ theme }) => theme.colors.text};
  }

  .post {
    background: ${({ theme }) => theme.colors.card};
    padding: 16px;
    border-radius: 8px solid ${({ theme }) => theme.colors.border};
    margin-bottom: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .home-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 900px;
    padding-top: 50px;
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
    width: calc(100% - 5rem);
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
    position: sticky;
    margin-top: 58px;
    max-width: 900px;
    width: calc(100vw - 5rem);

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
    align-content: flex-start;
    position: fixed;
    top: 80px;
    left: 2.5rem;
    right: 2.5rem;
  }

  .form-login {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: fixed;
    top: 72px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 5rem);
    max-width: 900px;
    /* row-gap: 4px; */

    @media (max-width: 350px) {
    font-size: 0.9rem;
    }
  }
`;
