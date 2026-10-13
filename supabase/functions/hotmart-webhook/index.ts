// PLANECITOS · Webhook de Hotmart → Supabase
// Hotmart avisa cada compra, reembolso o contracargo. Esta función lo guarda en la
// tabla purchases, y el trigger de la base de datos activa o quita el premium.
//
// Secretos necesarios (Supabase > Edge Functions > Secrets):
//   HOTMART_HOTTOK  → el "hottok" que muestra Hotmart al crear el webhook
// SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY ya existen en todas las funciones.
import { createClient } from "npm:@supabase/supabase-js@2";

const HOTTOK = Deno.env.get("HOTMART_HOTTOK") ?? "";
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Método no permitido", { status: 405 });

  // 1. Verificar que el aviso viene de Hotmart
  const token = req.headers.get("x-hotmart-hottok") ?? "";
  if (!HOTTOK || token !== HOTTOK) return new Response("No autorizado", { status: 401 });

  // 2. Leer el aviso
  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response("JSON inválido", { status: 400 });
  }
  const event: string | undefined = body?.event;
  const email: string | undefined = body?.data?.buyer?.email;
  const transaction: string | undefined = body?.data?.purchase?.transaction;
  if (!event || !email || !transaction) {
    console.log("Aviso ignorado: faltan datos", event);
    return new Response("ok", { status: 200 });
  }

  // 3. Guardar o actualizar la compra (el trigger se encarga del premium)
  const { error } = await supabase.from("purchases").upsert(
    {
      email: email.trim().toLowerCase(),
      buyer_name: body?.data?.buyer?.name ?? null,
      hotmart_transaction: transaction,
      hotmart_product_id: String(body?.data?.product?.id ?? ""),
      status: event,
      raw: body,
    },
    { onConflict: "hotmart_transaction" },
  );

  if (error) {
    console.error("Error guardando la compra:", error.message);
    return new Response("Error", { status: 500 }); // Hotmart reintentará
  }
  console.log("Compra guardada:", transaction, event);
  return new Response("ok", { status: 200 });
});
