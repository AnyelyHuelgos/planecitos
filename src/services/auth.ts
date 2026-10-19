import type { UserAccount } from "@/types/activity";
import { supabase, isBrowser } from "@/lib/supabase";
import { read, write } from "./store";
import { loadUserData, clearUserData } from "./profile";

// Sesión real con Supabase Auth.

export function getCurrentUser(): UserAccount | null {
  return read<UserAccount | null>("user", null);
}

/** true cuando ya sabemos si hay sesión o no (evita redirigir antes de tiempo). */
export function isSessionReady(): boolean {
  return read<boolean>("sessionReady", false);
}

function translate(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("expired") || m.includes("invalid") || m.includes("otp"))
    return "El código no es correcto o ya venció. Revisa los números o pide uno nuevo.";
  if (m.includes("signups not allowed") || m.includes("user not found"))
    return "No encontramos una cuenta con ese correo. Créala desde Registrarme.";
  if (m.includes("rate limit") || m.includes("too many") || m.includes("seconds"))
    return "Espera un minuto antes de pedir otro código.";
  if (m.includes("email")) return "Revisa que el correo esté bien escrito.";
  return "Algo salió mal. Intenta de nuevo.";
}

/**
 * Envía un código de 6 números al correo. Sin contraseña.
 * - Registro (createUser = true): crea la cuenta si no existe.
 * - Inicio de sesión (createUser = false): solo para cuentas que ya existen.
 */
export async function sendLoginCode(input: { email: string; name?: string; createUser: boolean }) {
  const { error } = await supabase.auth.signInWithOtp({
    email: input.email.trim().toLowerCase(),
    options: {
      shouldCreateUser: input.createUser,
      ...(input.name ? { data: { name: input.name.trim() } } : {}),
    },
  });
  return { error: error ? translate(error.message) : null };
}

/** Verifica el código y deja la sesión abierta en este dispositivo. */
export async function verifyLoginCode(input: { email: string; code: string }) {
  const { data, error } = await supabase.auth.verifyOtp({
    email: input.email.trim().toLowerCase(),
    token: input.code.replace(/\D/g, ""),
    type: "email",
  });
  if (error || !data.user) return { error: translate(error?.message ?? "invalid") };
  await loadUserData(data.user.id);
  return { error: null as string | null };
}

export async function signOut() {
  await supabase.auth.signOut();
  clearUserData();
}

let started = false;
/** Se llama una vez al cargar la app en el navegador. */
export function initSession() {
  if (!isBrowser || started) return;
  started = true;
  supabase.auth.getSession().then(async ({ data }) => {
    if (data.session) await loadUserData(data.session.user.id);
    write("sessionReady", true);
  });
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT" || !session) {
      clearUserData();
    } else if (event === "SIGNED_IN" || event === "USER_UPDATED") {
      // fuera del callback para no bloquear a Supabase
      setTimeout(() => void loadUserData(session.user.id), 0);
    }
  });
}
