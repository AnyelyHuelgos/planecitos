import { supabase } from "@/lib/supabase";
import type { Age } from "@/types/activity";

export interface StoryCard {
  id: string;
  slug: string;
  title: string;
  summary: string;
  minAge: Age;
  maxAge: Age;
  minutes: number;
  moment: string;
  theme: string;
  characterAge: Age;
  premium: boolean;
}
export interface Story extends StoryCard {
  pages: string[];
  question: string;
  game: string;
  activitySlug: string | null;
  locked: boolean;
}

type Row = {
  id: string; slug: string; title: string; summary: string; min_age: number; max_age: number; minutes: number;
  moment: string; theme: string; character_age: number; premium: boolean;
  pages?: string[]; question?: string; game?: string; activity_slug?: string | null;
};

function toCard(r: Row): StoryCard {
  return {
    id: r.id, slug: r.slug, title: r.title, summary: r.summary,
    minAge: r.min_age as Age, maxAge: r.max_age as Age, minutes: r.minutes,
    moment: r.moment, theme: r.theme, characterAge: r.character_age as Age, premium: r.premium,
  };
}

/** Portadas de todos los cuentos (también los premium, sin el texto). */
export async function listStories(): Promise<StoryCard[]> {
  const { data, error } = await supabase.rpc("get_story_catalog");
  if (error) {
    console.error("[cuentos]", error.message);
    return [];
  }
  return (data as Row[]).map(toCard);
}

/** Cuento completo si el usuario tiene acceso; si es premium y no, solo la portada (locked). */
export async function getStory(slug: string): Promise<Story | null> {
  const { data } = await supabase.from("stories").select("*").eq("slug", slug).maybeSingle();
  if (data) {
    const r = data as Row;
    return { ...toCard(r), pages: r.pages ?? [], question: r.question ?? "", game: r.game ?? "", activitySlug: r.activity_slug ?? null, locked: false };
  }
  const all = await listStories();
  const card = all.find((s) => s.slug === slug);
  return card ? { ...card, pages: [], question: "", game: "", activitySlug: null, locked: true } : null;
}

/** Pone el apodo del niño como protagonista del cuento. */
export function personalize(text: string, nickname?: string | null) {
  const name = nickname?.trim() || "Tomi";
  return text.replaceAll("{nombre}", name);
}
