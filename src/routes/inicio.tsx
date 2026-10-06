import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/pages/DashboardPage";

export const Route = createFileRoute("/inicio")({
  head: () => ({ meta: [{ title: "Inicio | Planecitos" }, { name: "description", content: "Tu planecito recomendado de hoy." }, { property: "og:title", content: "Inicio | Planecitos" }, { property: "og:description", content: "Tu planecito recomendado de hoy." }] }),
  component: DashboardPage,
});
