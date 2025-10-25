import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/api/authService";
import { useAuth } from "@/context/AuthContext";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password });
      // O back-end retorna { token, user: { id, email, role } }
      login({
        id: res.user.id,
        email: res.user.email,
        role: res.user.role,
        token: res.token,
      });
      navigate("/admin");
    } catch {
      alert("Credenciais inválidas");
    }
  }

  return (
    <form onSubmit={handleLogin} className="form-login">
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
      <button type="submit">Entrar</button>
    </form>
  );
}
