import { createFileRoute } from "@tanstack/react-router";
import { SelectorPage } from "@/pages/SelectorPage";

export const Route = createFileRoute("/selector")({
  head: () => ({ meta: [{ title: "Encontrar mi planecito | Planecitos" }, { name: "description", content: "Elige edad, tiempo y materiales y recibe una actividad lista." }, { property: "og:title", content: "Encontrar mi planecito | Planecitos" }, { property: "og:description", content: "Elige edad, tiempo y materiales y recibe una actividad lista." }] }),
  component: SelectorPage,
});
