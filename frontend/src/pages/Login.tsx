import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "@/api/authService";
import { useAuth } from "@/hooks/useAuth";

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
      // O back-end retorna { token, user: { id, email, role } }
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
    <form onSubmit={handleLogin} className="form-login" id="form-login">
      <h2>Login de professores</h2>
      <input
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" className="btn-primary">Entrar</button>
    </form>
  );
}
