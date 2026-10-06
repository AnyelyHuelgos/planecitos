import type { ChildProfile, UserAccount } from "@/types/activity";
import { supabase } from "@/lib/supabase";
import { read, write } from "./store";
import { getCatalog, loadCatalog } from "./catalog";

// Perfil, niño y favoritos guardados en Supabase.

type ChildRow = { id: string; nickname: string | null; age: number };

export function getChildProfile(): ChildProfile | null {
  return read<ChildProfile | null>("child", null);
}

/** Favoritos como slugs (así los usan las páginas). */
export function getFavorites(): string[] {
  return read<string[]>("favorites", []);
}

export async function loadUserData(userId: string) {
  const [profileRes, childRes, favRes, catalog] = await Promise.all([
    supabase.from("profiles").select("email, name, is_premium").eq("id", userId).maybeSingle(),
    supabase.from("children").select("id, nickname, age").eq("user_id", userId).order("created_at").limit(1),
    supabase.from("favorites").select("activity_id").eq("user_id", userId).order("created_at", { ascending: false }),
    loadCatalog(),
  ]);

  const p = profileRes.data;
  if (p) {
    write<UserAccount>("user", { name: p.name ?? p.email.split("@")[0] ?? "familia", email: p.email, premium: p.is_premium });
  }

  const c = (childRes.data as ChildRow[] | null)?.[0];
  write("childId", c?.id ?? null);
  write<ChildProfile | null>("child", c ? { name: c.nickname ?? "", age: c.age as ChildProfile["age"] } : null);

  const ids = (favRes.data ?? []).map((f) => f.activity_id as string);
  write("favorites", ids.map((id) => catalog.find((a) => a.id === id)?.slug).filter((s): s is string => !!s));
}

export function clearUserData() {
  write("user", null);
  write("child", null);
  write("childId", null);
  write("favorites", []);
}

async function currentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function saveChildProfile(p: ChildProfile) {
  const userId = await currentUserId();
  if (!userId) return { error: "Inicia sesión para guardar el perfil." };
  const childId = read<string | null>("childId", null);
  const values = { nickname: p.name.trim() || null, age: p.age };
  const res = childId
    ? await supabase.from("children").update(values).eq("id", childId).select("id").single()
    : await supabase.from("children").insert({ ...values, user_id: userId }).select("id").single();
  if (res.error) return { error: "No pudimos guardar el perfil. Intenta de nuevo." };
  write("childId", res.data.id);
  write("child", p);
  return { error: null };
}

export async function toggleFavorite(slug: string) {
  const userId = await currentUserId();
  if (!userId) return { error: "Inicia sesión para guardar tus planecitos." };
  const activity = getCatalog().find((a) => a.slug === slug);
  if (!activity) return { error: "No encontramos ese planecito." };

  const favs = getFavorites();
  const isFav = favs.includes(slug);
  // Cambio optimista: la interfaz responde de inmediato
  write("favorites", isFav ? favs.filter((s) => s !== slug) : [slug, ...favs]);

  const { error } = isFav
    ? await supabase.from("favorites").delete().eq("user_id", userId).eq("activity_id", activity.id)
    : await supabase.from("favorites").insert({ user_id: userId, activity_id: activity.id });

  if (error) {
    write("favorites", favs); // revertir
    return { error: "No pudimos guardar el cambio. Intenta de nuevo." };
  }
  return { error: null };
}
