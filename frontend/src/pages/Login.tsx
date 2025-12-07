import styled from "styled-components";
import { FiLock } from "react-icons/fi";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "@/api/authService";
import { useAuth } from "@/hooks/useAuth";

const PageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh; /* ocupa 100% da tela */
  background: #f3f4f6; /* cor única e suave */
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.1);
  padding: 60px 70px;
  width: 100%;
  max-width: 460px; /* tamanho do card aumentado */
  text-align: center;
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #e0ebff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 22px auto;

  svg {
    font-size: 38px;
    color: #2563eb;
  }
`;

const Title = styled.h2`
  color: #1e3a8a;
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 6px;
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
  margin-bottom: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;

  input {
    width: 100%;
    padding: 14px 16px;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    font-size: 1rem;
    transition: 0.2s ease;
    color: #1f2937;
    background-color: #f9fafb;

    &:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
    }

    &::placeholder {
      color: #9ca3af;
    }
  }

  button {
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 10px;
    padding: 14px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 8px;
    transition: background 0.25s ease;

    &:hover {
      background: #1e40af;
    }
  }
`;

const Hint = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
  margin-top: 18px;
`;

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || "/";

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password });
      login({
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        role: res.user.role,
        token: res.token,
      });
      navigate(from, { replace: true });
    } catch {
      alert("Credenciais inválidas");
    }
  }

  return (
    <PageWrapper>
      <Card>
        <IconWrapper>
          <FiLock />
        </IconWrapper>

        <Title>Acesso Docente</Title>
        <Subtitle>Entre para gerenciar o conteúdo.</Subtitle>

        <Form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="professor@fiap.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Entrar no Sistema</button>
        </Form>

        <Hint>Dica: profx@professor.com / senh@</Hint>
      </Card>
    </PageWrapper>
  );
}
