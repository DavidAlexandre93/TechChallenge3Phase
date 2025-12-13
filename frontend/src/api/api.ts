import axios, { type AxiosRequestHeaders, type InternalAxiosRequestConfig } from "axios";

const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: VITE_API_URL,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const user = localStorage.getItem("user");

  if (user) {
    const token = JSON.parse(user).token;

    if (!config.headers) {
      config.headers = {} as AxiosRequestHeaders;
    }

    config.headers!.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
