import { describe, it, expect, beforeEach, vi } from "vitest";
import { loginUser } from "@/api/authService";
import api from "@/api/api";
import type { AxiosRequestConfig } from "axios";

describe("authService", () => {
  let lastConfig: AxiosRequestConfig | null = null;

  beforeEach(() => {
    vi.clearAllMocks();
    lastConfig = null;

    api.defaults.adapter = vi.fn(async (config) => {
      lastConfig = config;

      return {
        data: { token: "123", user: { email: "test@test.com", role: "user", id: "1" } },
        status: 200,
        statusText: "OK",
        headers: config.headers,
        config,
      };
    });
  });

  it("envia os dados corretos para login", async () => {
    const payload = { email: "john@test.com", password: "123" };

    const res = await loginUser(payload);

    expect(lastConfig!.url).toBe("/auth/login");
    expect(lastConfig!.method).toBe("post");
    expect(lastConfig!.data).toBe(JSON.stringify(payload));

    expect(res).toEqual({
      token: "123",
      user: { email: "test@test.com", role: "user", id: "1" },
    });
  });
});
