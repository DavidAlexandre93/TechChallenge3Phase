import api from "./api";

interface LoginData {
  email: string;
  password: string;
}

export async function loginUser(data: LoginData) {
  const res = await api.post("/auth/login", data);
  return res.data; // { token, user: { email, role, id } }
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role?: string;
}) {
  const res = await api.post("/auth/register", data);
  return res.data;
}
