import api from "./api";

interface LoginData {
  email: string;
  password: string;
}

export async function loginUser(data: LoginData) {
  const res = await api.post("/auth/login", data);
  return res.data; // { token, user: { email, role, id } }
}