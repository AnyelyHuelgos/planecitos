import { createFileRoute } from "@tanstack/react-router";
import { PremiumPage } from "@/pages/AccountPages";

export const Route = createFileRoute("/premium")({
  head: () => ({ meta: [{ title: "Acceso fundadores | Planecitos" }, { name: "description", content: "Desbloquea todos los planecitos con un pago único." }, { property: "og:title", content: "Acceso fundadores | Planecitos" }, { property: "og:description", content: "Desbloquea todos los planecitos con un pago único." }] }),
  component: PremiumPage,
});
