import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// `server-only` throws outside the Next.js server bundle; tests run server modules directly.
vi.mock("server-only", () => ({}));

// jsdom has no layout engine and no ResizeObserver; chart containers (recharts) only need one to exist.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal("ResizeObserver", ResizeObserverStub);

// Testing Library only auto-cleans when Vitest globals are on; they are off here.
afterEach(() => {
  cleanup();
});
