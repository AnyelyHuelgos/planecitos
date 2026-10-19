// Analytics hook points. Wire a real tracker (e.g. Meta Pixel) here later.
export type AnalyticsEvent =
  | "hero_cta_click"
  | "selector_started"
  | "selector_completed"
  | "activity_viewed"
  | "checkout_clicked"
  | "login_started"
  | "signup_started"
  | "login_completed"
  | "signup_completed";

export function track(event: AnalyticsEvent, data?: Record<string, unknown>) {
  if (import.meta.env.DEV) console.debug("[analytics]", event, data ?? {});
}
