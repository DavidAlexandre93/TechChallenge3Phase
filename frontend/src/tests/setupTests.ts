import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Limpa mocks antes de cada teste
beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});
