import { createClient } from "@supabase/supabase-js";

// Datos del proyecto de Supabase (Project Settings > API).
// La URL y la clave pública (anon / publishable) están hechas para ir en el
// frontend: la seguridad la dan las políticas RLS de la base de datos.
// NUNCA pongas aquí la clave service_role / secret.
export const SUPABASE_URL = "https://dcfbidzwlyozhusdaygb.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_qtUg_M7S8aYVKqYEa2tl8w_tWU5_9kH";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

export const isBrowser = typeof window !== "undefined";
