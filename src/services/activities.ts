import { activities } from "@/data/activities";
import type { Activity, SelectorFilters } from "@/types/activity";

// Mock implementations — replace with Supabase queries later.

export async function listActivities(): Promise<Activity[]> {
  return activities;
}

export async function getActivityBySlug(slug: string): Promise<Activity | null> {
  return activities.find((a) => a.slug === slug) ?? null;
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

/** Returns ranked matches; falls back to relaxing filters so there's always a planecito. */
export async function findActivities(f: SelectorFilters): Promise<Activity[]> {
  const attempts: SelectorFilters[] = [
    f,
    { ...f, materials: undefined },
    { age: f.age, duration: f.duration },
    { age: f.age },
    {},
  ];
  for (const attempt of attempts) {
    const res = activities.filter((a) => matchesFilters(a, attempt));
    if (res.length) return res;
  }
  return activities;
}
