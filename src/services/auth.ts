import type { UserAccount } from "@/types/activity";
import { read, write } from "./store";

// Placeholder auth — replace bodies with supabase.auth.* calls later.

export function getCurrentUser(): UserAccount | null {
  return read<UserAccount | null>("user", null);
}

export async function signUp(input: { name: string; email: string; password: string }) {
  write<UserAccount>("user", { name: input.name, email: input.email, premium: false });
  return { error: null as string | null };
}

export async function signIn(input: { email: string; password: string }) {
  const existing = getCurrentUser();
  write<UserAccount>("user", existing ?? { name: input.email.split("@")[0], email: input.email, premium: false });
  return { error: null as string | null };
}

export async function requestPasswordReset(_email: string) {
  return { error: null as string | null };
}

export async function signOut() {
  write("user", null);
}
