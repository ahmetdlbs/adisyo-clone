import { useMemo, useSyncExternalStore } from "react";

// Demo-grade session marker kept in localStorage (the original app keeps its token there too).
// Nothing sensitive sits behind it: all POS data in this clone is mock data.

const SESSION_STORAGE_KEY = "adisyo.session";

export interface Session {
  username: string;
  signedInAt: number;
}

export type SessionStatus = "loading" | "authenticated" | "anonymous";

type RawSession = string | null | undefined;

const listeners = new Set<() => void>();
let memoryFallback: string | null = null;

function readRaw(): RawSession {
  try {
    return window.localStorage.getItem(SESSION_STORAGE_KEY);
  } catch {
    return memoryFallback;
  }
}

function writeRaw(value: string | null): void {
  try {
    if (value === null) window.localStorage.removeItem(SESSION_STORAGE_KEY);
    else window.localStorage.setItem(SESSION_STORAGE_KEY, value);
  } catch (error) {
    console.error("[session] storage unavailable, keeping the session in memory", error);
    memoryFallback = value;
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

// `undefined` marks "not known yet" while rendering on the server / during hydration.
const readServerSnapshot = (): RawSession => undefined;

function parseSession(raw: string): Session | null {
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "object" || value === null) return null;
    const { username, signedInAt } = value as Record<string, unknown>;
    if (typeof username !== "string" || username === "") return null;
    return { username, signedInAt: typeof signedInAt === "number" ? signedInAt : 0 };
  } catch {
    return null;
  }
}

export function startSession(username: string): void {
  const session: Session = { username, signedInAt: Date.now() };
  writeRaw(JSON.stringify(session));
}

export function endSession(): void {
  writeRaw(null);
}

export function useSession(): { status: SessionStatus; session: Session | null } {
  const raw = useSyncExternalStore(subscribe, readRaw, readServerSnapshot);
  return useMemo(() => {
    if (raw === undefined) return { status: "loading", session: null };
    const session = raw ? parseSession(raw) : null;
    return session
      ? { status: "authenticated", session }
      : { status: "anonymous", session: null };
  }, [raw]);
}
