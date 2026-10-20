// Medición de Planecitos con el píxel de Meta.
// Los eventos de compra (InitiateCheckout y Purchase) los envía Hotmart desde su checkout,
// con el mismo píxel configurado en el producto. Aquí medimos lo que pasa en nuestra web.
import { META_PIXEL_ID } from "@/config/pixel";

export type AnalyticsEvent =
  | "hero_cta_click"
  | "selector_started"
  | "selector_completed"
  | "activity_viewed"
  | "checkout_clicked"
  | "login_started"
  | "signup_started"
  | "login_completed"
  | "signup_completed"
  | "story_started"
  | "story_completed"
  | "printable_downloaded"
  | "sos_clicked";

type Fbq = ((...args: unknown[]) => void) & { callMethod?: (...a: unknown[]) => void; queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown };
declare global {
  interface Window { fbq?: Fbq; _fbq?: Fbq }
}

const isBrowser = typeof window !== "undefined";
let started = false;

/** Carga el píxel una sola vez y registra la primera visita. */
export function initPixel() {
  if (!isBrowser || started || !META_PIXEL_ID) return;
  started = true;
  if (!window.fbq) {
    const n = function (...args: unknown[]) {
      n.callMethod ? n.callMethod(...args) : n.queue!.push(args);
    } as Fbq;
    n.queue = [];
    n.loaded = true;
    n.version = "2.0";
    n.push = n;
    window.fbq = n;
    window._fbq = n;
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(s);
  }
  window.fbq!("init", META_PIXEL_ID);
  window.fbq!("track", "PageView");
}

/** Visita a una página nueva dentro de la web (la web no recarga al navegar). */
export function trackPageView() {
  if (isBrowser && window.fbq) window.fbq("track", "PageView");
}

// Cómo se llama cada evento en Meta. Los estándar sirven para optimizar campañas.
const META: Partial<Record<AnalyticsEvent, { name: string; standard: boolean }>> = {
  signup_completed: { name: "CompleteRegistration", standard: true },
  activity_viewed: { name: "ViewContent", standard: true },
  checkout_clicked: { name: "ClicDesbloquear", standard: false },
  hero_cta_click: { name: "ClicEdad", standard: false },
  selector_completed: { name: "SelectorCompletado", standard: false },
  story_started: { name: "CuentoAbierto", standard: false },
  printable_downloaded: { name: "ImprimibleDescargado", standard: false },
  sos_clicked: { name: "PlanecitoSOS", standard: false },
};

export function track(event: AnalyticsEvent, data?: Record<string, unknown>) {
  if (import.meta.env.DEV) console.debug("[analytics]", event, data ?? {});
  const m = META[event];
  if (!m || !isBrowser || !window.fbq) return;
  // Nunca enviamos datos del niño: solo el tipo de contenido y, si aplica, el slug.
  const params = data?.["slug"] ? { content_name: String(data["slug"]) } : {};
  window.fbq(m.standard ? "track" : "trackCustom", m.name, params);
}
