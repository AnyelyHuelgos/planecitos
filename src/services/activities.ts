import type { Activity, SelectorFilters } from "@/types/activity";
import { supabase } from "@/lib/supabase";
import { loadCatalog, toActivity, type ActivityRow } from "./catalog";

/**
 * Actividades completas (con pasos) que este usuario puede ver.
 * RLS decide: sin cuenta o sin premium → solo gratis; premium → todas.
 */
export async function listActivities(): Promise<Activity[]> {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("published", true)
    .order("created_at");
  if (error) {
    console.error("[activities]", error.message);
    return [];
  }
  return (data as ActivityRow[]).map((r) => toActivity(r));
}

/**
 * Detalle de un planecito. Si es premium y el usuario no tiene acceso,
 * devuelve solo los datos de la tarjeta (sin pasos) para mostrar el candado.
 */
export async function getActivityBySlug(slug: string): Promise<Activity | null> {
  const { data } = await supabase.from("activities").select("*").eq("slug", slug).maybeSingle();
  if (data) return toActivity(data as ActivityRow);
  const catalog = await loadCatalog();
  return catalog.find((a) => a.slug === slug) ?? null;
}

export function matchesFilters(a: Activity, f: SelectorFilters): boolean {
  if (f.age && (f.age < a.minAge || f.age > a.maxAge)) return false;
  if (f.duration && a.duration > f.duration) return false;
  if (f.category && a.category !== f.category) return false;
  if (f.materials && f.materials.length && !f.materials.includes("nada")) {
    const ok = a.materialTags.every((m) => m === "nada" || f.materials!.includes(m));
    if (!ok) return false;
  }
  return true;
}

/** Devuelve coincidencias; si no hay, relaja filtros para que siempre haya un planecito. */
export async function findActivities(f: SelectorFilters): Promise<Activity[]> {
  const all = await listActivities();
  const attempts: SelectorFilters[] = [
    f,
    { ...f, materials: undefined },
    { age: f.age, duration: f.duration },
    { age: f.age },
    {},
  ];
  for (const attempt of attempts) {
    const res = all.filter((a) => matchesFilters(a, attempt));
    if (res.length) return res;
  }
  return all;
}
