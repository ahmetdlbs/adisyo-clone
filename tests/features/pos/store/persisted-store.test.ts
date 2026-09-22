import { afterEach, describe, expect, it, vi } from "vitest";
import { createPersistedStore, type StorageLike } from "@/features/pos/store/persisted-store";

interface Counter {
  count: number;
}

const KEY = "test.counter";
const INITIAL: Counter = { count: 0 };

const parse = (raw: unknown): Counter | null =>
  typeof raw === "object" && raw !== null && typeof (raw as Counter).count === "number" ? (raw as Counter) : null;

function memoryStorage(seed: Record<string, string> = {}): StorageLike & { data: Record<string, string> } {
  const data = { ...seed };
  return {
    data,
    getItem: (key) => data[key] ?? null,
    setItem: (key, value) => {
      data[key] = value;
    },
  };
}

const build = (storage: StorageLike | null) => createPersistedStore({ key: KEY, initial: INITIAL, parse, storage });

afterEach(() => vi.restoreAllMocks());

describe("createPersistedStore", () => {
  it("starts from the initial state when nothing is stored", () => {
    expect(build(memoryStorage()).getState()).toEqual(INITIAL);
  });

  it("always serves the initial state to the server render", () => {
    const store = build(memoryStorage({ [KEY]: JSON.stringify({ count: 7 }) }));

    expect(store.getServerState()).toEqual(INITIAL);
    expect(store.getState()).toEqual({ count: 7 });
  });

  it("loads a valid stored state", () => {
    expect(build(memoryStorage({ [KEY]: JSON.stringify({ count: 3 }) })).getState()).toEqual({ count: 3 });
  });

  it.each([
    ["broken JSON", "{not json"],
    ["the wrong shape", JSON.stringify({ count: "three" })],
  ])("falls back to the initial state for %s, and says so", (_label, stored) => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(build(memoryStorage({ [KEY]: stored })).getState()).toEqual(INITIAL);
    expect(error).toHaveBeenCalled();
  });

  it("writes every change to storage", () => {
    const storage = memoryStorage();
    const store = build(storage);

    store.setState((state) => ({ count: state.count + 1 }));

    expect(JSON.parse(storage.data[KEY] ?? "null")).toEqual({ count: 1 });
  });

  it("tells subscribers about a change, and stops after unsubscribe", () => {
    const store = build(memoryStorage());
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    store.setState(() => ({ count: 1 }));
    unsubscribe();
    store.setState(() => ({ count: 2 }));

    expect(listener).toHaveBeenCalledOnce();
  });

  it("hands out the same state object until something changes", () => {
    const store = build(memoryStorage());

    expect(store.getState()).toBe(store.getState());
  });

  it("keeps working in memory when storage is unavailable, and reports it", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const failing: StorageLike = {
      getItem: () => null,
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
    };
    const store = build(failing);

    store.setState(() => ({ count: 5 }));

    expect(store.getState()).toEqual({ count: 5 });
    expect(error).toHaveBeenCalled();
  });

  it("works with no storage at all (server, tests)", () => {
    const store = build(null);

    store.setState(() => ({ count: 9 }));

    expect(store.getState()).toEqual({ count: 9 });
  });

  it("picks up a change made in another tab", () => {
    const storage = memoryStorage();
    const store = build(storage);
    const listener = vi.fn();
    store.subscribe(listener);

    storage.data[KEY] = JSON.stringify({ count: 42 });
    store.reload();

    expect(store.getState()).toEqual({ count: 42 });
    expect(listener).toHaveBeenCalled();
  });
});
