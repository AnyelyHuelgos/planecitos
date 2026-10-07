import { createFileRoute } from "@tanstack/react-router";
import { SelectorPage } from "@/pages/SelectorPage";
import type { Age } from "@/types/activity";

export const Route = createFileRoute("/selector")({
  validateSearch: (s: Record<string, unknown>): { age?: Age } => {
    const n = Number(s["age"]);
    return n >= 2 && n <= 5 ? { age: n as Age } : {};
  },
  head: () => ({ meta: [{ title: "Encontrar mi planecito | Planecitos" }, { name: "description", content: "Elige edad, tiempo y materiales y recibe una actividad lista." }, { property: "og:title", content: "Encontrar mi planecito | Planecitos" }, { property: "og:description", content: "Elige edad, tiempo y materiales y recibe una actividad lista." }] }),
  component: SelectorPage,
});
