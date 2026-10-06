import type { Activity, Age, Category, Duration, Location, Material } from "@/types/activity";
import { supabase } from "@/lib/supabase";
import { read, write } from "./store";

// Catálogo de tarjetas: todas las actividades publicadas (también las premium),
// sin pasos ni detalle. Viene de la función get_catalog() de Supabase.

type CatalogRow = {
  id: string; slug: string; title: string; short_description: string;
  min_age: number; max_age: number; duration: number; category: string; location: string;
  material_tags: string[]; adult_help: boolean; premium: boolean; image_url: string | null;
};

export type ActivityRow = CatalogRow & {
  description: string; materials: string[]; preparation: string; steps: string[]; tip: string;
};

export function toActivity(r: CatalogRow & Partial<ActivityRow>): Activity {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    shortDescription: r.short_description,
    description: r.description ?? "",
    minAge: r.min_age as Age,
    maxAge: r.max_age as Age,
    duration: r.duration as Duration,
    category: r.category as Category,
    location: r.location as Location,
    materials: r.materials ?? [],
    materialTags: r.material_tags as Material[],
    adultHelp: r.adult_help,
    preparation: r.preparation ?? "",
    steps: r.steps ?? [],
    tip: r.tip ?? "",
    premium: r.premium,
    image: r.image_url,
  };
}

const empty: Activity[] = [];
let loading: Promise<Activity[]> | null = null;

export function getCatalog(): Activity[] {
  return read<Activity[]>("catalog", empty);
}

/** Carga el catálogo una sola vez y lo comparte entre páginas. */
export function loadCatalog(): Promise<Activity[]> {
  if (!loading) {
    loading = (async () => {
      const { data, error } = await supabase.rpc("get_catalog");
      if (error) {
        console.error("[catalog]", error.message);
        loading = null;
        return empty;
      }
      const list = (data as CatalogRow[]).map((r) => toActivity(r));
      write("catalog", list);
      return list;
    })();
  }
  return loading;
}

export function findInCatalog(slug: string): Activity | undefined {
  return getCatalog().find((a) => a.slug === slug);
}
