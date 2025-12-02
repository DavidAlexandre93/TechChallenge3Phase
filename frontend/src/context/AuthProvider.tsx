import { useState } from "react";
import type { ReactNode } from 'react';
import { AuthContext, type User } from "@/context/AuthContext";

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
