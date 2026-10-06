// Estado en memoria compartido por los servicios (sesión, niño, favoritos, catálogo).
// Los datos reales viven en Supabase; esto solo los guarda mientras la app está abierta.
type Listener = () => void;
const listeners = new Set<Listener>();
const state = new Map<string, unknown>();

export function read<T>(key: string, fallback: T): T {
  return state.has(key) ? (state.get(key) as T) : fallback;
}

export function write<T>(key: string, value: T | null) {
  if (value === null) state.delete(key);
  else state.set(key, value);
  listeners.forEach((l) => l());
}

export function subscribe(l: Listener) {
  listeners.add(l);
  return () => listeners.delete(l);
}
