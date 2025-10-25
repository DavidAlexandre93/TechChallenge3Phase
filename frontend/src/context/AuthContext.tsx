import { createContext, useContext, useState } from "react";
import type { ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  role: "TEACHER" | "STUDENT";
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  // 🧠 Tenta recuperar o usuário salvo no localStorage (caso já tenha feito login)
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // 🔐 Faz login: salva no estado e no localStorage
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // 🚪 Faz logout: limpa tudo
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar facilmente em qualquer componente
export const useAuth = () => useContext(AuthContext);
