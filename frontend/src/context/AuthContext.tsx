import { createContext } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "TEACHER" | "STUDENT";
  token: string;
}

export interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);
