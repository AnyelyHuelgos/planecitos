import type { ChildProfile } from "@/types/activity";
import { read, write } from "./store";

// Placeholder profile + favorites — replace with Supabase tables later.

export function getChildProfile(): ChildProfile | null {
  return read<ChildProfile | null>("child", null);
}

export async function saveChildProfile(p: ChildProfile) {
  write("child", p);
}

export function getFavorites(): string[] {
  return read<string[]>("favorites", []);
}

export async function toggleFavorite(slug: string) {
  const favs = getFavorites();
  write("favorites", favs.includes(slug) ? favs.filter((s) => s !== slug) : [slug, ...favs]);
}
