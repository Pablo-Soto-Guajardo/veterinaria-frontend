import "@testing-library/jest-dom/vitest";
import { crearApiFalsa } from "./apiFalsa";

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  const api = crearApiFalsa();
  globalThis.apiFalsa = api;
  vi.stubGlobal("fetch", vi.fn(api.fetch));
});

afterEach(() => {
  vi.unstubAllGlobals();
});