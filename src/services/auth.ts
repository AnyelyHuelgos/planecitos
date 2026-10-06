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
  if (m.includes("invalid login")) return "Correo o contraseña incorrectos.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Ya existe una cuenta con ese correo. Inicia sesión.";
  if (m.includes("email not confirmed")) return "Confirma tu correo antes de entrar. Revisa tu bandeja.";
  if (m.includes("password")) return "La contraseña debe tener al menos 6 caracteres.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Demasiados intentos. Espera unos minutos e intenta de nuevo.";
  return "Algo salió mal. Intenta de nuevo.";
}

export async function signUp(input: { name: string; email: string; password: string }) {
  const { data, error } = await supabase.auth.signUp({
    email: input.email.trim().toLowerCase(),
    password: input.password,
    options: {
      data: { name: input.name.trim() },
      ...(isBrowser ? { emailRedirectTo: `${window.location.origin}/onboarding` } : {}),
    },
  });
  if (error) return { error: translate(error.message), needsConfirmation: false };
  // Si Supabase pide confirmar el correo, todavía no hay sesión.
  if (!data.session) return { error: null, needsConfirmation: true };
  await loadUserData(data.session.user.id);
  return { error: null, needsConfirmation: false };
}

export async function signIn(input: { email: string; password: string }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email.trim().toLowerCase(),
    password: input.password,
  });
  if (error) return { error: translate(error.message) };
  await loadUserData(data.user.id);
  return { error: null as string | null };
}

export async function requestPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(
    email.trim().toLowerCase(),
    isBrowser ? { redirectTo: `${window.location.origin}/nueva-contrasena` } : {},
  );
  return { error: error ? translate(error.message) : null };
}

export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({ password });
  return { error: error ? translate(error.message) : null };
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
