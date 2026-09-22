export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface Store<S> {
  getState(): S;
  /** What the server rendered: always the initial state, so hydration never mismatches. */
  getServerState(): S;
  setState(update: (state: S) => S): void;
  subscribe(listener: () => void): () => void;
  /** Re-reads storage, e.g. after another tab wrote to it. */
  reload(): void;
}

interface StoreOptions<S> {
  key: string;
  initial: S;
  /** Validates what came out of storage; return null to reject it. */
  parse: (raw: unknown) => S | null;
  /** Defaults to `window.localStorage`; pass `null` for memory only. */
  storage?: StorageLike | null;
}

function browserStorage(): StorageLike | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    // Some private modes throw on access.
    return null;
  }
}

/**
 * A small external store for `useSyncExternalStore`, mirrored to storage. It is read lazily on the client and
 * validated on the way in, and it degrades to memory-only (with a console error) when storage fails.
 */
export function createPersistedStore<S>({ key, initial, parse, storage }: StoreOptions<S>): Store<S> {
  const listeners = new Set<() => void>();
  let state: S | undefined;
  let hasReportedWriteFailure = false;
  let detachStorageListener: (() => void) | undefined;

  const resolveStorage = () => (storage === undefined ? browserStorage() : storage);

  function load(): S {
    const source = resolveStorage();
    if (!source) return initial;

    try {
      const raw = source.getItem(key);
      if (raw === null) return initial;
      const parsed = parse(JSON.parse(raw));
      if (parsed === null) throw new Error("stored data does not match the expected shape");
      return parsed;
    } catch (error) {
      console.error(`[store] ignoring unreadable data for "${key}"`, error);
      return initial;
    }
  }

  function persist(value: S) {
    try {
      resolveStorage()?.setItem(key, JSON.stringify(value));
    } catch (error) {
      if (!hasReportedWriteFailure) {
        hasReportedWriteFailure = true;
        console.error(`[store] cannot save "${key}", keeping it in memory only`, error);
      }
    }
  }

  const notify = () => listeners.forEach((listener) => listener());
  const getState = () => (state ??= load());

  function reload() {
    state = load();
    notify();
  }

  function attachStorageListener() {
    if (typeof window === "undefined" || !resolveStorage()) return undefined;
    const onStorage = (event: StorageEvent) => {
      if (event.key === key || event.key === null) reload();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }

  return {
    getState,
    getServerState: () => initial,
    setState(update) {
      state = update(getState());
      persist(state);
      notify();
    },
    subscribe(listener) {
      listeners.add(listener);
      detachStorageListener ??= attachStorageListener();
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          detachStorageListener?.();
          detachStorageListener = undefined;
        }
      };
    },
    reload,
  };
}
