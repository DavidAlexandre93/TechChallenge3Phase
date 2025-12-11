import api from "@/api/api";
import type { InternalAxiosRequestConfig } from "axios";
import { vi, describe, it, expect, beforeEach } from "vitest";

describe("API instance", () => {
  const originalEnv = import.meta.env.VITE_API_URL;

  // variável para capturar o config enviado pelo axios
  let lastConfig: InternalAxiosRequestConfig | null = null;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    lastConfig = null;

    api.defaults.adapter = vi.fn(async (config) => {
      lastConfig = config;

      return {
        data: "ok",
        status: 200,
        statusText: "OK",
        headers: config.headers,
        config,
      };
    });
  });

  it("usa a URL base corretamente", () => {
    expect(api.defaults.baseURL).toBe(
      originalEnv || "http://localhost:4000"
    );
  });

  it("adiciona Authorization quando existe usuário no localStorage", async () => {
    localStorage.setItem("user", JSON.stringify({ token: "ABC123" }));

    await api.get("/posts");

    expect(lastConfig!.headers.Authorization).toBe("Bearer ABC123");
  });

  it("não adiciona Authorization se não houver user", async () => {
    await api.get("/posts");

    expect(lastConfig!.headers?.Authorization).toBeUndefined();
  });

  it("cria headers caso não existam", async () => {
    localStorage.setItem("user", JSON.stringify({ token: "XYZ" }));

    await api.get("/posts");

    expect(lastConfig!.headers).toBeDefined();
    expect(lastConfig!.headers.Authorization).toBe("Bearer XYZ");
  });
});
