import { supabase } from "@/lib/supabase";

export interface Printable {
  id: string;
  slug: string;
  title: string;
  description: string;
  kind: string;
  minAge: number;
  maxAge: number;
  filePath: string;
  premium: boolean;
}

export async function listPrintables(): Promise<Printable[]> {
  const { data, error } = await supabase.from("printables").select("*").eq("published", true).order("premium").order("created_at");
  if (error) {
    console.error("[imprimibles]", error.message);
    return [];
  }
  return (data ?? []).map((r) => ({
    id: r.id, slug: r.slug, title: r.title, description: r.description, kind: r.kind,
    minAge: r.min_age, maxAge: r.max_age, filePath: r.file_path, premium: r.premium,
  }));
}

/**
 * Crea un enlace temporal (5 minutos) al PDF. Supabase solo lo entrega si el archivo es
 * gratis o si el usuario es premium: la protección está en el almacenamiento, no en el botón.
 */
export async function getDownloadUrl(filePath: string) {
  const { data, error } = await supabase.storage.from("imprimibles").createSignedUrl(filePath, 300, { download: true });
  if (error || !data) return { url: null, error: "No pudimos preparar la descarga. Si ya compraste, inicia sesión e intenta de nuevo." };
  return { url: data.signedUrl, error: null };
}
