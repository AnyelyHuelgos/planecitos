// Tiny local store used by mock services until Supabase is connected.
type Listener = () => void;
const listeners = new Set<Listener>();
const cache = new Map<string, unknown>();

export function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  if (cache.has(key)) return cache.get(key) as T;
  try {
    const raw = window.localStorage.getItem(`planecitos:${key}`);
    const v = raw ? (JSON.parse(raw) as T) : fallback;
    cache.set(key, v);
    return v;
  } catch {
    return fallback;
  }
}

export function write<T>(key: string, value: T | null) {
  cache.delete(key);
  if (value === null) window.localStorage.removeItem(`planecitos:${key}`);
  else window.localStorage.setItem(`planecitos:${key}`, JSON.stringify(value));
  listeners.forEach((l) => l());
}

export function subscribe(l: Listener) {
  listeners.add(l);
  return () => listeners.delete(l);
}
